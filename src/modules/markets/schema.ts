import { z } from "zod";

export const marketCategoryEnum = z.enum([
  "EPISODES",
  "CHAPTERS",
  "ADAPTATIONS",
  "CHARACTERS",
  "COMMUNITY",
  "OTHER",
]);

export const marketTypeEnum = z.enum(["YES_NO", "MULTIPLE_CHOICE", "NUMERIC"]);
export const marketStatusEnum = z.enum(["DRAFT", "OPEN", "CLOSED", "RESOLVED", "CANCELLED"]);

export const listMarketsSchema = z.object({
  category: marketCategoryEnum.optional(),
  seriesId: z.string().optional(),
  status: marketStatusEnum.optional(),
  search: z.string().optional(),
  sort: z.enum(["closingSoon", "newest", "volume"]).optional(),
  take: z.coerce.number().min(1).max(50).optional().default(20),
  skip: z.coerce.number().min(0).optional().default(0),
});

export const createMarketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10).max(2000).optional(),
  category: marketCategoryEnum.default("OTHER"),
  marketType: marketTypeEnum,
  resolutionDeadline: z.string(),
  relatedSeriesId: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
      }),
    )
    .optional(),
});

export const resolveYesNoSchema = z.object({
  outcome: z.enum(["YES", "NO"]),
  note: z.string().optional(),
});

export const resolveMultipleChoiceSchema = z.object({
  optionId: z.string(),
  note: z.string().optional(),
});

export const resolveNumericSchema = z.object({
  numericResult: z.number(),
  note: z.string().optional(),
});

export type ListMarketsInput = z.infer<typeof listMarketsSchema>;
export type CreateMarketInput = z.infer<typeof createMarketSchema>;
