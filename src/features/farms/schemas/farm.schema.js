import { z } from 'zod';

export const addFarmSchema = z.object({
  name: z.string().min(2, 'Farm name is required'),
  location: z.string().min(2, 'Location is required'),
  area: z.string().transform(v => Number(v)),
  numberOfHives: z.string().transform(v => Number(v)),
  beeSpecies: z.string().min(2, 'Bee species is required'),
  floralSource: z.string().min(2, 'Floral source is required'),
});
