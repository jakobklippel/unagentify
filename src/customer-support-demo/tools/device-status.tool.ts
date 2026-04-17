import { z } from 'zod';
import { BaseTool, Tool, ToolResult } from '@loopstack/common';
import { MockDbService } from '../mock-db.service';

const DeviceStatusSchema = z
  .object({
    where: z.object({
      id: z.string().optional().describe('Device ID, e.g. "DEV-4001"'),
      customerId: z.string().optional().describe('Customer ID to find all their devices'),
      productId: z.string().optional().describe('Product ID to find all devices of that type'),
    }),
  })
  .strict()
  .refine(
    (data) => {
      const keys = Object.values(data.where).filter(Boolean);
      return keys.length >= 1;
    },
    { message: 'Provide at least one filter in "where": id, customerId, or productId.' },
  );

type DeviceStatusArgs = z.infer<typeof DeviceStatusSchema>;

@Tool({
  uiConfig: {
    description:
      'Look up device status including firmware version, online status, configuration, and recent logs. Query by device id, customer id, or product id.',
  },
  schema: DeviceStatusSchema,
})
export class DeviceStatusTool extends BaseTool {
  constructor(private readonly db: MockDbService) {
    super();
  }

  async call(args: DeviceStatusArgs): Promise<ToolResult> {
    const { where } = args;

    if (where.id) {
      const device = this.db.findDeviceById(where.id);
      return { data: device ?? { error: `No device found with id "${where.id}"` } };
    }

    let results = where.customerId
      ? this.db.findDevicesByCustomerId(where.customerId)
      : this.db.findDevicesByProductId(where.productId!);

    if (where.customerId && where.productId) {
      results = results.filter((d) => d.productId === where.productId);
    }

    return { data: { rows: results, totalCount: results.length } };
  }
}
