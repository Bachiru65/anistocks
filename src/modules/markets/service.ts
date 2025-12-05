import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { SessionPayload } from "@/lib/session";
import type { CreateMarketInput, ListMarketsInput } from "./schema";

const parseDeadline = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid resolutionDeadline date", 400);
  }
  return date;
};

export const listMarkets = async (filters: ListMarketsInput, session?: SessionPayload) => {
  const where: Prisma.MarketWhereInput = {};
  if (filters.category) where.category = filters.category;
  if (filters.seriesId) where.relatedSeriesId = filters.seriesId;
  if (filters.status) where.status = filters.status;
  if (filters.search) where.title = { contains: filters.search, mode: "insensitive" };
  if (!session || session.role !== "ADMIN") {
    where.isApproved = true;
    where.status = where.status || { in: ["OPEN", "RESOLVED", "CLOSED"] };
  }

  const orderBy =
    filters.sort === "closingSoon"
      ? { resolutionDeadline: "asc" }
      : filters.sort === "volume"
        ? { totalStake: "desc" }
        : { createdAt: "desc" };

  return prisma.market.findMany({
    where,
    include: {
      relatedSeries: true,
      options: true,
    },
    orderBy,
    take: filters.take ?? 20,
    skip: filters.skip ?? 0,
  });
};

export const getMarketById = async (id: string, session?: SessionPayload) => {
  const market = await prisma.market.findUnique({
    where: { id },
    include: {
      relatedSeries: true,
      options: true,
    },
  });
  if (!market) throw new AppError("NOT_FOUND", "Market not found", 404);
  if (!market.isApproved && session?.role !== "ADMIN" && session?.userId !== market.createdById) {
    throw new AppError("FORBIDDEN", "Market not approved yet", 403);
  }
  return market;
};

export const createMarket = async (input: CreateMarketInput, session: SessionPayload) => {
  const deadline = parseDeadline(input.resolutionDeadline);
  if (deadline <= new Date()) {
    throw new AppError("VALIDATION_ERROR", "Resolution deadline must be in the future", 400);
  }

  const options =
    input.marketType === "MULTIPLE_CHOICE"
      ? input.options ?? []
      : [
          { label: "Yes" },
          { label: "No" },
        ];

  if (options.length < 2) {
    throw new AppError("VALIDATION_ERROR", "At least two options are required", 400);
  }

  const market = await prisma.market.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      marketType: input.marketType,
      resolutionDeadline: deadline,
      relatedSeriesId: input.relatedSeriesId,
      createdById: session.userId,
      status: "OPEN",
      isApproved: session.role === "ADMIN" ? true : false,
      options: {
        create: options.map((opt, idx) => ({
          label: opt.label,
          order: idx,
        })),
      },
    },
    include: { options: true },
  });

  return market;
};
