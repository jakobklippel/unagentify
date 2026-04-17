import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const SubscriptionLookupSchema = z
  .object({
    where: z.object({
      id: z.string().optional().describe('Subscription ID, e.g. "SUB-3001"'),
      customerId: z.string().optional().describe('Customer ID to find all their subscriptions'),
    }),
  })
  .strict()
  .refine(
    (data) => {
      const keys = Object.values(data.where).filter(Boolean);
      return keys.length >= 1;
    },
    { message: 'Provide at least one filter in "where": id or customerId.' },
  );

type SubscriptionLookupArgs = z.infer<typeof SubscriptionLookupSchema>;

@Tool({
  uiConfig: {
    description:
      'Look up subscriptions including plan type, billing cycle, status, cancellation dates, and upgrade history. Query by subscription id or customer id.',
  },
  schema: SubscriptionLookupSchema,
})
export class SubscriptionLookupTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: SubscriptionLookupArgs): Promise<ToolResult> {
    const { where } = args;

    if (where.id) {
      const sub = this.db.findSubscriptionById(where.id);
      return { data: sub ?? { error: `No subscription found with id "${where.id}"` } };
    }

    const results = this.db.findSubscriptionsByCustomerId(where.customerId!);
    return { data: { rows: results, totalCount: results.length } };
  }
}
