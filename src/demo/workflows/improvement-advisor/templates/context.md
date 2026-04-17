## Evaluation Results

### KPIs

| Metric | Score |
|--------|-------|
| Average Factual Accuracy | {{evaluation.kpis.avgFactualAccuracy}}% |
| Correct Resolution Rate | {{evaluation.kpis.correctResolutionRate}}% |
| Pitfall Avoidance Rate | {{evaluation.kpis.pitfallAvoidanceRate}}% |
| Overall Score | {{evaluation.kpis.overallScore}}% |

### Per-Ticket Evaluations

{{#each evaluation.ticketEvaluations}}
**{{this.ticketId}}** — Accuracy: {{this.factualAccuracy}}% | Resolution: {{this.correctResolution}} | Pitfalls avoided: {{this.noPitfalls}}
{{#unless this.noPitfalls}}Pitfalls hit: {{#each this.pitfallsHit}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/unless}}
Notes: {{this.notes}}

{{/each}}

### Evaluator Summary

{{evaluation.summary}}

---

Start by exploring the codebase to understand the current implementation, then analyse the evaluation results and draft your improvement concept.
