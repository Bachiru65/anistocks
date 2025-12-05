import { Prisma } from "@prisma/client";
import { AppError } from "@/lib/errors";
import { SessionPayload } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { PlaceBetInput } from "./schema";
import { resolveMultipleChoiceSchema, resolveYesNoSchema } from "../markets/schema";

const Decimal = Prisma.Decimal;
type MarketWithOptions = Prisma.MarketGetPayload<{ include: { options: true } }>;
type MarketWithBets = Prisma.MarketGetPayload<{ include: { bets: true; options: true } }>;
type BetWithOption = MarketWithBets["bets"][number];

const assertMarketOpen = (market: MarketWithOptions) => {
  if (!market.isApproved) throw new AppError("FORBIDDEN", "Market not approved", 403);
  if (market.status !== "OPEN") throw new AppError("MARKET_CLOSED", "Market is not open", 400);
  if (market.resolutionDeadline < new Date()) {
    throw new AppError("MARKET_CLOSED", "Market deadline passed", 400);
  }
};

export const placeBet = async (marketId: string, input: PlaceBetInput, session: SessionPayload) => {
  const amount = new Decimal(input.amount);
  if (amount.lte(0)) throw new AppError("VALIDATION_ERROR", "Amount must be positive", 400);

  const market = await prisma.market.findUnique({
    where: { id: marketId },
    include: { options: true },
  });
  if (!market) throw new AppError("NOT_FOUND", "Market not found", 404);
  assertMarketOpen(market);

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.userId } });
  if (!wallet) throw new AppError("NOT_FOUND", "Wallet not found", 404);
  if (wallet.balanceTokens.lt(amount)) {
    throw new AppError("INSUFFICIENT_FUNDS", "Not enough balance", 400);
  }

  let optionId: string | null = null;
  let side: "YES" | "NO" | undefined;

  if (market.marketType === "YES_NO") {
    if (!input.side) throw new AppError("VALIDATION_ERROR", "side is required for YES/NO", 400);
    side = input.side;
    const matchedOption = market.options.find((opt) =>
      side === "YES" ? opt.label.toLowerCase() === "yes" : opt.label.toLowerCase() === "no",
    );
    optionId = matchedOption?.id ?? null;
  } else if (market.marketType === "MULTIPLE_CHOICE") {
    if (!input.optionId) throw new AppError("VALIDATION_ERROR", "optionId is required", 400);
    const exists = market.options.find((opt) => opt.id === input.optionId);
    if (!exists) throw new AppError("VALIDATION_ERROR", "option does not belong to market", 400);
    optionId = input.optionId;
  } else {
    throw new AppError("UNSUPPORTED", "Numeric markets not yet supported for betting", 400);
  }

  return prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { userId: session.userId },
      data: { balanceTokens: { decrement: amount } },
      select: { id: true, balanceTokens: true },
    });

    const bet = await tx.bet.create({
      data: {
        userId: session.userId,
        marketId,
        optionId,
        side: side ?? null,
        amountTokens: amount,
        impliedOdds: null,
      },
    });

    await tx.transaction.create({
      data: {
        userId: session.userId,
        walletId: updatedWallet.id,
        type: "DEBIT",
        reason: "BET_PLACED",
        amountTokens: amount,
        balanceAfter: updatedWallet.balanceTokens,
        description: `Bet on ${market.title}`,
      },
    });

    await tx.market.update({
      where: { id: marketId },
      data: { totalStake: { increment: amount } },
    });

    return bet;
  });
};

const sumDecimal = (values: Prisma.Decimal[]) =>
  values.reduce((acc, val) => acc.add(val), new Decimal(0));

const creditWallet = async (
  tx: Prisma.TransactionClient,
  userId: string,
  amount: Prisma.Decimal,
  reason: "BET_PAYOUT" | "BET_REFUND",
  description: string,
) => {
  const wallet = await tx.wallet.update({
    where: { userId },
    data: { balanceTokens: { increment: amount } },
    select: { id: true, balanceTokens: true },
  });

  await tx.transaction.create({
    data: {
      userId,
      walletId: wallet.id,
      type: "CREDIT",
      reason,
      amountTokens: amount,
      balanceAfter: wallet.balanceTokens,
      description,
    },
  });
};

export const resolveMarket = async (
  marketId: string,
  payload: { outcome?: "YES" | "NO"; optionId?: string; note?: string; numericResult?: number },
  session: SessionPayload,
) => {
  if (session.role !== "ADMIN") {
    throw new AppError("FORBIDDEN", "Admin access required", 403);
  }

  return prisma.$transaction(async (tx) => {
    const market = await tx.market.findUnique({
      where: { id: marketId },
      include: { bets: { where: { status: "OPEN" } }, options: true },
    });
    if (!market) throw new AppError("NOT_FOUND", "Market not found", 404);
    if (!["OPEN", "CLOSED"].includes(market.status)) {
      throw new AppError("INVALID_STATE", "Market already resolved or cancelled", 400);
    }

    let winningFilter: (bet: BetWithOption) => boolean;
    let resolvedYes: boolean | null = null;
    let resolvedOptionId: string | null = null;

    if (market.marketType === "YES_NO") {
      const parsed = resolveYesNoSchema.parse(payload);
      resolvedYes = parsed.outcome === "YES";
      winningFilter = (bet) => bet.side === parsed.outcome;
    } else if (market.marketType === "MULTIPLE_CHOICE") {
      const parsed = resolveMultipleChoiceSchema.parse(payload);
      const optionExists = market.options.find((opt) => opt.id === parsed.optionId);
      if (!optionExists) throw new AppError("VALIDATION_ERROR", "Winning option not in market", 400);
      resolvedOptionId = parsed.optionId;
      winningFilter = (bet) => bet.optionId === parsed.optionId;
    } else {
      throw new AppError("UNSUPPORTED", "Numeric resolution not yet supported", 400);
    }

    const totalPool = sumDecimal(market.bets.map((b) => b.amountTokens));
    const winningBets = market.bets.filter(winningFilter);
    const winningPool = sumDecimal(winningBets.map((b) => b.amountTokens));

    if (totalPool.eq(0)) {
      await tx.market.update({
        where: { id: market.id },
        data: {
          status: "RESOLVED",
          resolvedYes,
          resolvedOutcomeId: resolvedOptionId,
          resolvedNumeric: null,
          resolutionNote: payload.note,
        },
      });
      await tx.marketResolutionLog.create({
        data: {
          marketId: market.id,
          resolvedBy: session.userId,
          outcomeNote: payload.note,
        },
      });
      return { totalPayouts: 0 };
    }

    if (winningPool.eq(0)) {
      // Refund all bets if no winners
      for (const bet of market.bets) {
        await creditWallet(tx, bet.userId, bet.amountTokens, "BET_REFUND", `Refund for ${market.title}`);
        await tx.bet.update({
          where: { id: bet.id },
          data: { status: "REFUNDED", payoutAwarded: bet.amountTokens, settledAt: new Date() },
        });
      }
    } else {
      for (const bet of market.bets) {
        const isWinner = winningFilter(bet);
        if (isWinner) {
          const payout = bet.amountTokens.mul(totalPool).div(winningPool);
          await creditWallet(tx, bet.userId, payout, "BET_PAYOUT", `Payout for ${market.title}`);
          await tx.bet.update({
            where: { id: bet.id },
            data: { status: "WON", payoutAwarded: payout, settledAt: new Date() },
          });
        } else {
          await tx.bet.update({
            where: { id: bet.id },
            data: { status: "LOST", settledAt: new Date() },
          });
        }
      }
    }

    await tx.market.update({
      where: { id: market.id },
        data: {
          status: "RESOLVED",
          resolvedYes,
          resolvedOutcomeId: resolvedOptionId,
          resolvedNumeric: null,
          resolutionNote: payload.note,
        },
      });

    await tx.marketResolutionLog.create({
      data: {
        marketId: market.id,
        resolvedBy: session.userId,
        outcomeNote: payload.note,
      },
    });

    return { totalPool: totalPool.toNumber(), winningPool: winningPool.toNumber() };
  });
};
