## Aggregate KPIs

| Metric | Score |
|--------|-------|
| Average Factual Accuracy | {{kpis.avgFactualAccuracy}}% |
| Correct Resolution Rate | {{kpis.correctResolutionRate}}% |
| Pitfall Avoidance Rate | {{kpis.pitfallAvoidanceRate}}% |
| Overall Score | {{kpis.overallScore}}% |

## Per-Ticket Results

{{#each evaluations}}
### {{this.ticketId}}
- **Factual Accuracy:** {{this.factualAccuracy}}%
- **Correct Resolution:** {{this.correctResolution}}
- **Pitfalls Avoided:** {{this.noPitfalls}}{{#unless this.noPitfalls}} — Hit: {{#each this.pitfallsHit}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/unless}}
- **Notes:** {{this.notes}}

{{/each}}

Write the summary.
