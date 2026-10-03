import fs from "fs";
import path from "path";
import crypto from "crypto";
import { UsageError } from "../util/errors";
import { canonicalJson, isIdentityUuid } from "../graph/identity";
import { readWorkingHost, WorkingHost } from "./working_host";
import { loadConfig } from "./config";
import { GraphContext, GraphVisibility, graphNameError } from "./graph_context";
import { readContainedFileIfPresent, atomicReplaceContainedFile, withContainedPathSink } from "./filesystem_authority";
import { assertNoGitMetadataDestinations } from "../util/git_metadata";
import { observeGit } from "../util/git_observation";

export const GRAPH_REGISTRY_PATH = ".mdkg-graphs.local.json";
export const GRAPH_REGISTRY_LOCK = ".mdkg-graphs.lock";
type Entry = { name: string; root: string; visibility: GraphVisibility; binding: WorkingHost };
export type GraphRegistry = { format: "mdkg-graph-registry"; version: 1; default_binding: WorkingHost | null; graphs: Entry[] };
export type RegistryRequest = { action: "register" | "unregister"; name: string; target?: string; visibility?: GraphVisibility };
export type RegistryPlan = {
  action: "graph.registry"; host_root: string; request: RegistryRequest;
  change: { name: string; root: string; visibility: GraphVisibility; binding: WorkingHost; operation: "register" | "unregister" };
  inputs: Record<string, string | null>;
  registry_after_sha256: string; ignore_after_sha256: string; ignore_additions: string[];
  plan_hash: string;
};
function fail(message: string): never { throw new UsageError(message); }
function sha(content: string | null): string | null { return content === null ? null : crypto.createHash("sha256").update(content).digest("hex"); }
function key(value: string): string { return value.normalize("NFC").toLowerCase(); }
function overlap(a: string, b: string): boolean { a=key(a);b=key(b);return a===b || a.startsWith(b+"/") || b.startsWith(a+"/"); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value!=="object" || Array.isArray(value)) fail("invalid local graph registry object");
  return value as Record<string, unknown>;
}
function fields(value: Record<string, unknown>, allowed: string[]): void {
  if (Object.keys(value).some(k=>!allowed.includes(k))) fail("unsupported local graph registry field");
}
function binding(value: unknown): WorkingHost {
  const x=object(value);fields(x,["kind","id"]);
  if ((x.kind!=="canonical-v2" && x.kind!=="working-host-v1") || !isIdentityUuid(x.id)) fail("invalid local graph binding");
  return {kind:x.kind,id:x.id};
}
function relativeRoot(value: unknown): string {
  if (typeof value!=="string" || !value || value!==value.normalize("NFC") || value.length>512 ||
      value.includes("\\") || /[\x00-\x1f\x7f]/.test(value) || path.posix.isAbsolute(value) || path.win32.isAbsolute(value) ||
      value.split("/").some(p=>!p || p==="." || p==="..")) fail("graph root must be an exact contained relative project directory");
  return value;
}
function alias(name: string): void {
  const error=graphNameError(name);if(error || name==="default")fail(error??"default graph cannot be registered");
}
/** Reject aliases/links without opening other registered roots or graph data. */
function directory(host: string, rel: string): string {
  relativeRoot(rel);
  let current=host;
  for(const part of rel.split("/")) {
    if(fs.readdirSync(current).some(n=>key(n)===key(part)&&n!==part))fail("graph root has a case/Unicode alias");
    current=path.join(current,part);
    const stat=fs.lstatSync(current);
    if(!stat.isDirectory()||stat.isSymbolicLink())fail("graph root requires existing non-linked directories");
    if(fs.existsSync(path.join(current,".git")) || ["HEAD","objects","config"].every(n=>fs.existsSync(path.join(current,n))))
      fail("graph root overlaps a nested Git repository/store");
  }
  return current;
}
function read(root: string, file: string, maxBytes=64*1024): string | null {
  const value=readContainedFileIfPresent({root,relativePath:file,maxBytes});
  if(value!==null)withContainedPathSink({root,relativePath:file,operation:"read"},({absolutePath})=>{
    if(fs.lstatSync(absolutePath).nlink!==1)fail("graph metadata refuses hard-linked files");
  });
  return value;
}
function hostBinding(root: string): WorkingHost | null {
  read(root,".mdkg/graph.json");read(root,".mdkg/working-host.json",4096);
  return readWorkingHost(root)??null;
}
function same(a: WorkingHost | null,b: WorkingHost | null): boolean {return canonicalJson(a)===canonicalJson(b);}
function parseRegistry(content: string): GraphRegistry {
  let value:unknown;try{value=JSON.parse(content);}catch{fail("invalid local graph registry JSON");}
  const x=object(value);fields(x,["format","version","default_binding","graphs"]);
  if(x.format!=="mdkg-graph-registry"||x.version!==1||!Array.isArray(x.graphs)||x.graphs.length>100)fail("unsupported/oversized local graph registry");
  const defaultBinding=x.default_binding===null?null:binding(x.default_binding);
  const graphs:Entry[]=x.graphs.map(v=>{
    const e=object(v);fields(e,["name","root","visibility","binding"]);
    if(typeof e.name!=="string")fail("invalid local graph alias");alias(e.name);
    if(!["private","internal","public"].includes(String(e.visibility)))fail("invalid local graph visibility");
    return {name:e.name,root:relativeRoot(e.root),visibility:e.visibility as GraphVisibility,binding:binding(e.binding)};
  });
  for(let i=0;i<graphs.length;i++) {
    if(defaultBinding?.id===graphs[i].binding.id)fail("local graph binding collides with default graph");
    for(let j=0;j<i;j++)if(graphs[i].name===graphs[j].name||overlap(graphs[i].root,graphs[j].root)||graphs[i].binding.id===graphs[j].binding.id)
      fail("local graph registry contains colliding aliases, roots or identities");
  }
  return {format:"mdkg-graph-registry",version:1,default_binding:defaultBinding,graphs};
}
export function readGraphRegistry(host: string): GraphRegistry | undefined {
  const content=read(host,GRAPH_REGISTRY_PATH);return content===null?undefined:parseRegistry(content);
}
function tracked(host: string, rel: string): boolean {
  if(!gitInside(host))return false;
  return observeGit(host,["ls-files","--cached","-z","--",rel],{env:registryGitEnvironment()}).stdout.length>0;
}
function ignored(host: string, rel: string): boolean {
  if(!gitInside(host))return false;
  // check-ignore accepts literal filenames, not pathspec magic. Setting
  // GIT_LITERAL_PATHSPECS=1 makes Git reject even an ordinary filename here.
  return observeGit(host,["check-ignore","-q","--",rel],{allowedFailures:[1],env:{...registryGitEnvironment(),GIT_LITERAL_PATHSPECS:"0"}}).status===0;
}
function registryGitEnvironment():NodeJS.ProcessEnv {
  const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>!key.toUpperCase().startsWith("GIT_")));
  return {...env,GIT_LITERAL_PATHSPECS:"1"};
}
function gitInside(host:string):boolean {
  const r=observeGit(host,["rev-parse","--is-inside-work-tree"],{env:registryGitEnvironment(),allowedFailures:[128]});
  if(r.status===128) {
    if(/^fatal: not a git repository \((?:or any of the parent directories|or any parent up to mount point [^\n]+)\)/m.test(r.stderr))return false;
    fail("invalid host Git metadata; preserve it and review the repository boundary");
  }
  if(r.stdout!=="true\n"&&r.stdout!=="false\n")fail("invalid host Git work-tree observation");
  return r.stdout==="true\n";
}
function requireLocalPolicy(host: string,e: Entry): void {
  if(tracked(host,GRAPH_REGISTRY_PATH)||!ignored(host,GRAPH_REGISTRY_PATH)||!ignored(host,GRAPH_REGISTRY_LOCK+"/owner.json"))
    fail("local graph registry/lock must remain ignored and untracked");
  if(e.visibility==="private" && (tracked(host,e.root)||!ignored(host,e.root+"/.mdkg/config.json")))
    fail("private graph root must remain ignored and untracked");
}
function ownerPaths(host: string): string[] {
  const reserved=[".mdkg",".git",GRAPH_REGISTRY_PATH,GRAPH_REGISTRY_LOCK,"node_modules"];
  if(read(host,".mdkg/config.json")!==null) {
    const c=loadConfig(host);
    for(const w of Object.values(c.workspaces))reserved.push(path.posix.normalize(`${w.path}/${w.mdkg_dir}`));
    reserved.push(...c.customization.skill_mirrors.targets);
  }
  return reserved;
}
function admitEntry(host: string,e: Entry,checkPolicy: boolean): string {
  if(ownerPaths(host).some(p=>overlap(e.root,p)))fail("graph root overlaps host canonical storage or mirrors");
  const root=directory(host,e.root);
  if(read(root,".mdkg/config.json")===null)fail("registered root must contain an existing independent .mdkg/config.json");
  if(!same(hostBinding(root),e.binding))fail("selected graph binding is missing, changed or foreign; no automatic repair");
  if(checkPolicy)requireLocalPolicy(host,e);
  return root;
}
export function resolveGraphContext(hostRoot: string,name?: string): GraphContext {
  const host=path.resolve(hostRoot);
  if(name===undefined||name==="default")return Object.freeze({host_root:host,root:host,...(name?{name}: {})});
  alias(name);
  const registry=readGraphRegistry(host),entry=registry?.graphs.find(e=>e.name===name);
  if(!registry||!entry)fail(`unknown graph: ${name}; register an existing independent root explicitly`);
  if(!same(hostBinding(host),registry.default_binding))fail("host namespace binding changed; review the local registry mappings explicitly");
  const root=admitEntry(host,entry,true);
  return Object.freeze({host_root:host,root,name,binding:Object.freeze({...entry.binding}),visibility:entry.visibility});
}
function ignorePattern(value:string):string {return "/"+value.replace(/[\\ *?!#[\]]/g,"\\$&");}
function fence(root:string):string {const s=fs.lstatSync(root);if(!s.isDirectory()||s.isSymbolicLink())fail("invalid graph root fence");return `${s.dev}:${s.ino}`;}
function prepare(hostRoot: string,request: RegistryRequest): {plan:RegistryPlan;registry:string;ignore:string;oldRegistry:string|null;oldIgnore:string|null} {
  const host=path.resolve(hostRoot);alias(request.name);
  if(request.action!=="register"&&request.action!=="unregister")fail("unsupported graph registry action");
  if(!gitInside(host))fail("ignored local graph registry requires a Git work tree");
  const oldRegistry=read(host,GRAPH_REGISTRY_PATH),oldIgnore=read(host,".gitignore",1024*1024);
  if(tracked(host,GRAPH_REGISTRY_PATH))fail("local graph registry must not be tracked");
  const defaultBinding=hostBinding(host);
  const before=oldRegistry===null?{format:"mdkg-graph-registry" as const,version:1 as const,default_binding:defaultBinding,graphs:[]}:parseRegistry(oldRegistry);
  const existing=before.graphs.find(e=>e.name===request.name);
  let selected:Entry;
  if(request.action==="unregister") {
    if(request.target!==undefined||request.visibility!==undefined)fail("unregister does not accept target or visibility");
    if(!existing)fail(`unknown graph: ${request.name}`);selected=existing;
  } else {
    const target=relativeRoot(request.target),visibility=request.visibility??"private";
    if(!["private","internal","public"].includes(visibility))fail("graph visibility must be private, internal or public");
    if(ownerPaths(host).some(p=>overlap(target,p)))fail("graph root overlaps host canonical storage or mirrors");
    const root=directory(host,target),b=hostBinding(root);
    if(!b)fail("graph has no proven binding; explicitly review 0.6.2 working-host adoption first");
    selected={name:request.name,root:target,visibility,binding:b};
    if(existing&&canonicalJson(existing)!==canonicalJson(selected))fail("existing mapping changed; preview/unregister it before a new reviewed registration");
    admitEntry(host,selected,false);
    if(visibility==="private"&&(!gitInside(host)||tracked(host,target)))fail("private graph requires an ignored untracked root in a Git work tree");
  }
  const graphs=before.graphs.filter(e=>e.name!==request.name);
  if(request.action==="register")graphs.push(selected);
  const registry=JSON.stringify({format:before.format,version:1,default_binding:defaultBinding,graphs:graphs.sort((a,b)=>a.name.localeCompare(b.name))},null,2)+"\n";
  parseRegistry(registry); // collision check uses metadata only, never sibling scanning
  let ignore=oldIgnore??"";const additions:string[]=[];
  for(const p of [ignorePattern(GRAPH_REGISTRY_PATH),ignorePattern(GRAPH_REGISTRY_LOCK)+"/",
    ...(request.action==="register"&&selected.visibility==="private"?[ignorePattern(selected.root)+"/"]:[])])
    if(!ignore.split(/\r?\n/).includes(p)){additions.push(p);ignore+=(ignore&&!ignore.endsWith("\n")?"\n":"")+p+"\n";}
  assertNoGitMetadataDestinations(host,[GRAPH_REGISTRY_PATH,".gitignore",GRAPH_REGISTRY_LOCK+"/owner.json"]);
  const selectedRoot=path.join(host,selected.root);
  const base={action:"graph.registry" as const,host_root:host,request:{...request},
    change:{...selected,operation:request.action},inputs:{registry_sha256:sha(oldRegistry),ignore_sha256:sha(oldIgnore),
      host_fence:fence(host),selected_root_fence:request.action==="register"?fence(selectedRoot):null,default_binding_sha256:sha(canonicalJson(defaultBinding)),
      default_config_sha256:sha(read(host,".mdkg/config.json")),selected_config_sha256:request.action==="register"?sha(read(selectedRoot,".mdkg/config.json")):null},
    registry_after_sha256:sha(registry)!,ignore_after_sha256:sha(ignore)!,ignore_additions:additions};
  return {plan:{...base,plan_hash:sha(canonicalJson(base))!},registry,ignore,oldRegistry,oldIgnore};
}
export function previewGraphRegistry(host:string,request:RegistryRequest):RegistryPlan{return prepare(host,request).plan;}
export function applyGraphRegistry(host:string,plan:RegistryPlan,hash:string,afterIgnoreWrite?:()=>void):{ok:true;action:string;name:string;plan_hash:string} {
  if(!/^[0-9a-f]{64}$/.test(hash)||hash!==plan.plan_hash)fail("registry apply requires its exact reviewed plan hash");
  const first=prepare(host,plan.request);if(first.plan.plan_hash!==hash)fail("stale registry plan; preview current inputs again");
  const lockPath=path.join(host,GRAPH_REGISTRY_LOCK);let lock:fs.Stats;
  withContainedPathSink({root:host,relativePath:GRAPH_REGISTRY_LOCK,operation:"create"},()=>{
    try{fs.mkdirSync(lockPath,{mode:0o700});}catch(e){if((e as NodeJS.ErrnoException).code==="EEXIST")fail("graph registry writer is busy; preserve the owner's lock");throw e;}
  });
  lock=fs.lstatSync(lockPath);
  try {
    const current=prepare(host,plan.request);if(current.plan.plan_hash!==hash)fail("stale registry plan under writer lock");
    if(current.ignore!==current.oldIgnore)atomicReplaceContainedFile({root:host,relativePath:".gitignore"},current.ignore);
    afterIgnoreWrite?.();
    const post=prepare(host,plan.request);
    if(post.oldRegistry!==current.oldRegistry || post.oldIgnore!==current.ignore ||
        canonicalJson({...post.plan.inputs,ignore_sha256:current.plan.inputs.ignore_sha256})!==canonicalJson(current.plan.inputs) ||
        post.plan.registry_after_sha256!==current.plan.registry_after_sha256)
      fail("registry inputs changed during application; preserve data and preview again");
    // Verify the visibility fence before exposing a newly registered mapping.
    // The second observation below also detects a changed Git index after write.
    if(plan.request.action==="register")requireLocalPolicy(host,current.plan.change);
    if(current.registry!==current.oldRegistry)atomicReplaceContainedFile({root:host,relativePath:GRAPH_REGISTRY_PATH,mode:0o600},current.registry);
    if(plan.request.action==="register")requireLocalPolicy(host,current.plan.change);
    return {ok:true,action:`graph.${plan.request.action}`,name:plan.request.name,plan_hash:hash};
  } finally {
    const s=fs.lstatSync(lockPath);if(s.dev===lock.dev&&s.ino===lock.ino&&!s.isSymbolicLink())fs.rmdirSync(lockPath);
  }
}
