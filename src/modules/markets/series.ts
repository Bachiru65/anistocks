import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { Prisma } from "@/generated/prisma/client";

export const createSeriesSchema = z.object({
  title: z.string().min(2),
  type: z.enum(["ANIME", "MANGA", "OTHER"]).default("OTHER"),
  malId: z.string().optional(),
  anilistId: z.string().optional(),
  synopsis: z.string().optional(),
});

export const listSeriesSchema = z.object({
  type: z.enum(["ANIME", "MANGA", "OTHER"]).optional(),
  q: z.string().optional(),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;

export const listSeries = async (filters: z.infer<typeof listSeriesSchema>) => {
  const where: Prisma.SeriesWhereInput = {};
  if (filters.type) where.type = filters.type;
  if (filters.q) where.title = { contains: filters.q, mode: "insensitive" };
  return prisma.series.findMany({ where, orderBy: { title: "asc" } });
};

export const createSeries = async (input: CreateSeriesInput) => {
  const exists = await prisma.series.findFirst({
    where: { title: { equals: input.title, mode: "insensitive" } },
  });
  if (exists) throw new AppError("SERIES_EXISTS", "Series already exists", 409);

  return prisma.series.create({
    data: input,
  });
};
