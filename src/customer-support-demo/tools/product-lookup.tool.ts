import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const ProductLookupSchema = z
  .object({
    where: z
      .object({
        id: z.string().optional().describe('Product ID, e.g. "PROD-001"'),
        slug: z.string().optional().describe('Product slug, e.g. "collar-pro"'),
      })
      .optional()
      .describe('Omit to list all products.'),
  })
  .strict();

type ProductLookupArgs = z.infer<typeof ProductLookupSchema>;

@Tool({
  uiConfig: {
    description:
      'Look up the PawPal product catalog. Query by id, slug, or omit "where" to list all products with pricing and variants.',
  },
  schema: ProductLookupSchema,
})
export class ProductLookupTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: ProductLookupArgs): Promise<ToolResult> {
    const where = args.where;

    if (!where || (!where.id && !where.slug)) {
      const results = this.db.getAllProducts();
      return { data: { rows: results, totalCount: results.length } };
    }

    if (where.id) {
      const product = this.db.findProductById(where.id);
      return { data: product ?? { error: `No product found with id "${where.id}"` } };
    }

    const product = this.db.findProductBySlug(where.slug!);
    return { data: product ?? { error: `No product found with slug "${where.slug}"` } };
  }
}
