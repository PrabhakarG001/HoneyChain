import { z } from 'zod';

export const createBatchSchema = z.object({
  farmId: z.string().min(1, 'Farm is required'),
  hiveId: z.string().min(1, 'Hive is required'),
  honeyType: z.string().min(1, 'Honey Type is required'),
  floralSource: z.string().min(1, 'Floral Source is required'),
  quantity: z.string().transform(v => Number(v)),
  harvestDate: z.string().min(1, 'Harvest Date is required'),
});
