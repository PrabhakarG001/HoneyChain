import { z } from 'zod';

export const addHiveSchema = z.object({
  beeSpecies: z.string().min(2, 'Bee species is required'),
});
