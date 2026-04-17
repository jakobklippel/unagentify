import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const OrderLookupSchema = z
  .object({
    where: z.object({
      id: z.string().optional().describe('Order ID, e.g. "ORD-1001"'),
      customerId: z.string().optional().describe('Customer ID to find all their orders'),
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

type OrderLookupArgs = z.infer<typeof OrderLookupSchema>;

@Tool({
  uiConfig: {
    description:
      'Look up orders including items, shipment tracking, and delivery status. Query by order id or customer id.',
  },
  schema: OrderLookupSchema,
})
export class OrderLookupTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: OrderLookupArgs): Promise<ToolResult> {
    const { where } = args;

    if (where.id) {
      const order = this.db.findOrderById(where.id);
      return { data: order ?? { error: `No order found with id "${where.id}"` } };
    }

    const results = this.db.findOrdersByCustomerId(where.customerId!);
    return { data: { rows: results, totalCount: results.length } };
  }
}
