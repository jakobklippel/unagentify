import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const KnowledgeBaseSearchSchema = z
  .object({
    where: z.object({
      id: z.string().optional().describe('Article ID, e.g. "KB-001"'),
      query: z.string().optional().describe('Free-text search across title, tags, and content'),
      category: z
        .enum(['policy', 'troubleshooting', 'faq', 'product-guide'])
        .optional()
        .describe('Filter by article category'),
    }),
  })
  .strict()
  .refine(
    (data) => {
      const keys = Object.values(data.where).filter(Boolean);
      return keys.length >= 1;
    },
    { message: 'Provide at least one filter in "where": id, query, or category.' },
  );

type KnowledgeBaseSearchArgs = z.infer<typeof KnowledgeBaseSearchSchema>;

@Tool({
  uiConfig: {
    description:
      'Search the PawPal knowledge base for policy articles, troubleshooting guides, and FAQs. Query by article id, free-text search, or category.',
  },
  schema: KnowledgeBaseSearchSchema,
})
export class KnowledgeBaseSearchTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: KnowledgeBaseSearchArgs): Promise<ToolResult> {
    const { where } = args;

    if (where.id) {
      const article = this.db.findKnowledgeBaseArticleById(where.id);
      return { data: article ?? { error: `No article found with id "${where.id}"` } };
    }

    let results = where.query ? this.db.searchKnowledgeBase(where.query) : this.db.getKnowledgeBaseByCategory(where.category!);

    if (where.query && where.category) {
      results = results.filter((a) => a.category === where.category);
    }

    return { data: { rows: results, totalCount: results.length } };
  }
}
