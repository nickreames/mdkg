import { useMemo, useState } from "react";

type Stage = {
  id: string;
  label: string;
  node: string;
  status: string;
  detail: string;
  command: string;
};

const stages: Stage[] = [
  {
    id: "select",
    label: "Select",
    node: "goal-1 -> spike-1",
    status: "ready",
    detail: "One selected goal resolves the next concrete work item.",
    command: "mdkg goal next goal-1 --json"
  },
  {
    id: "shape",
    label: "Shape",
    node: "CREATIVE_PRODUCTION_INTAKE.md",
    status: "bounded",
    detail: "Creative direction can vary while stack, claims, and safety stay fixed.",
    command: "mdkg pack spike-1 --profile concise --dry-run --stats"
  },
  {
    id: "build",
    label: "Build",
    node: "Astro + React Islands",
    status: "local",
    detail: "The site is built locally before any preview request is made.",
    command: "npm run build"
  },
  {
    id: "verify",
    label: "Verify",
    node: "test-1",
    status: "evidence",
    detail: "Browser, Chrome, no-secret, and public-claims proof decide what happens next.",
    command: "mdkg validate --json"
  }
];

export default function GoalRunConsole() {
  const [activeId, setActiveId] = useState(stages[0].id);
  const active = useMemo(() => stages.find((stage) => stage.id === activeId) ?? stages[0], [activeId]);

  return (
    <section className="console-panel" aria-label="Interactive mdkg goal run console">
      <div className="console-tabs" role="tablist" aria-label="Goal run stages">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={stage.id === active.id ? "console-tab active" : "console-tab"}
            onClick={() => setActiveId(stage.id)}
            role="tab"
            aria-selected={stage.id === active.id}
            aria-controls="goal-stage-panel"
          >
            <span>{stage.label}</span>
          </button>
        ))}
      </div>
      <div id="goal-stage-panel" className="console-output" role="tabpanel">
        <div>
          <p className="console-status">{active.status}</p>
          <h2>{active.node}</h2>
          <p>{active.detail}</p>
        </div>
        <pre aria-label="Current command"><code>{active.command}</code></pre>
      </div>
      <div className="console-metrics" aria-label="Run evidence summary">
        <div>
          <strong>1</strong>
          <span>goal start</span>
        </div>
        <div>
          <strong>12</strong>
          <span>pack nodes</span>
        </div>
        <div>
          <strong>0</strong>
          <span>validation warnings</span>
        </div>
      </div>
    </section>
  );
}
