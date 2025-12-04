import { prisma } from "@/lib/prisma";

export const getUserPositions = async (userId: string) => {
  return prisma.bet.findMany({
    where: { userId, status: { in: ["OPEN", "WON"] } },
    include: {
      market: {
        include: { options: true, relatedSeries: true },
      },
      option: true,
    },
    orderBy: { placedAt: "desc" },
  });
};

export const getUserTransactions = async (userId: string, take = 50) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
};
