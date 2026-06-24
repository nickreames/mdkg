# Research Spikes

Spikes are actionable research nodes. Use them when the next step is to investigate options, collect sources, compare tradeoffs, and create follow-up tasks or design nodes.

Create a spike:

```bash
mdkg new spike "Evaluate docs IA options" --json
mdkg task start SPIKE_ID
```

Good spike outputs:

- research question
- context and constraints
- source list
- findings
- options and tradeoffs
- recommendation
- follow-up tasks, tests, PRDs, EDDs, decisions, or skills

Spikes are not autonomous research runners. They do not automatically browse the web, generate `SKILL.md`, or mutate other repos. A human or agent performs the research and records the evidence.

Close the spike with evidence:

```bash
mdkg task done SPIKE_ID --checkpoint "Spike recommendation recorded"
mdkg validate
```
