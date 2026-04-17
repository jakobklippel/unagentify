import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const CustomerLookupSchema = z
  .object({
    where: z.object({
      id: z.string().optional().describe('Customer ID, e.g. "CUST-001"'),
      email: z.string().optional().describe('Exact email address'),
      search: z.string().optional().describe('Free-text search across name, email, and phone'),
    }),
  })
  .strict()
  .refine(
    (data) => {
      const keys = Object.values(data.where).filter(Boolean);
      return keys.length >= 1;
    },
    { message: 'Provide at least one filter in "where": id, email, or search.' },
  );

type CustomerLookupArgs = z.infer<typeof CustomerLookupSchema>;

@Tool({
  uiConfig: {
    description:
      'Look up customer profiles. Query by id, email, or free-text search (name/email/phone). Returns profile including tier, account age, and address.',
  },
  schema: CustomerLookupSchema,
})
export class CustomerLookupTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: CustomerLookupArgs): Promise<ToolResult> {
    const { where } = args;

    if (where.id) {
      const customer = this.db.findCustomerById(where.id);
      return { data: customer ?? { error: `No customer found with id "${where.id}"` } };
    }

    if (where.email) {
      const customer = this.db.findCustomerByEmail(where.email);
      return { data: customer ?? { error: `No customer found with email "${where.email}"` } };
    }

    const results = this.db.searchCustomers(where.search!);
    return { data: { rows: results, totalCount: results.length } };
  }
}
