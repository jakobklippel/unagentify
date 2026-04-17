import { z } from 'zod';
import { Document } from '@loopstack/common';

export const SupportResponseDocumentSchema = z
  .object({
    response: z.string().describe('The final customer-facing support response message.'),
  })
  .strict();

export type SupportResponseDocumentType = z.infer<typeof SupportResponseDocumentSchema>;

@Document({
  uiConfig: __dirname + '/support-response-document.yaml',
  schema: SupportResponseDocumentSchema,
})
export class SupportResponseDocument {
  response: string;
}
