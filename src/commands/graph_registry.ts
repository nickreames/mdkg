import { applyGraphRegistry, previewGraphRegistry, readGraphRegistry, RegistryRequest } from "../core/graph_selection";
import { UsageError } from "../util/errors";

export function runGraphRegistryCommand(options:{root:string;request:RegistryRequest;apply:boolean;planHash?:string;json:boolean}):void {
  if(options.apply&&!options.planHash)throw new UsageError("registry apply requires --plan-hash from an exact reviewed preview");
  if(!options.apply&&options.planHash)throw new UsageError("--plan-hash requires --apply");
  const plan=previewGraphRegistry(options.root,options.request);
  const result=options.apply?applyGraphRegistry(options.root,plan,options.planHash!):plan;
  if(options.json)console.log(JSON.stringify(result,null,2));
  else console.log(`${options.apply?"Applied":"Preview"} graph ${options.request.action}: ${options.request.name}\nplan hash: ${plan.plan_hash}`);
}
export function runGraphRegistrationsCommand(root:string,json:boolean):void {
  // Explicit host-level discovery only; never open/index registered graph roots.
  const registry=readGraphRegistry(root);
  const result={action:"graph.registrations",host_root:root,graphs:registry?.graphs??[]};
  if(json)console.log(JSON.stringify(result,null,2));
  else for(const e of result.graphs)console.log(`${e.name} | ${e.visibility} | ${e.root} | ${e.binding.kind}:${e.binding.id}`);
}
