import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const KnownIssuesLookupSchema = z
  .object({
    where: z
      .object({
        productId: z.string().optional().describe('Product ID to find all known issues for that product'),
        firmwareVersion: z
          .string()
          .optional()
          .describe('Firmware version to check against. Requires productId to be set as well.'),
      })
      .optional()
      .describe('Omit to list all active (unresolved) known issues.'),
  })
  .strict();

type KnownIssuesLookupArgs = z.infer<typeof KnownIssuesLookupSchema>;

@Tool({
  uiConfig: {
    description:
      'Check for known product issues and active incidents. Query by product id, product id + firmware version, or omit "where" to list all active issues.',
  },
  schema: KnownIssuesLookupSchema,
})
export class KnownIssuesLookupTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: KnownIssuesLookupArgs): Promise<ToolResult> {
    const where = args.where;

    if (!where || !where.productId) {
      const results = this.db.getAllActiveKnownIssues();
      return { data: { rows: results, totalCount: results.length } };
    }

    if (where.firmwareVersion) {
      const results = this.db.findKnownIssuesByFirmware(where.productId, where.firmwareVersion);
      return { data: { rows: results, totalCount: results.length } };
    }

    const results = this.db.findKnownIssuesByProductId(where.productId);
    return { data: { rows: results, totalCount: results.length } };
  }
}
