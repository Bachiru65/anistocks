import { z } from "zod";

export const placeBetSchema = z.object({
  amount: z.coerce.number().positive(),
  side: z.enum(["YES", "NO"]).optional(),
  optionId: z.string().optional(),
});

export type PlaceBetInput = z.infer<typeof placeBetSchema>;
