import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "../src/lib/password";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const Decimal = Prisma.Decimal;

const START_BALANCE = new Decimal(process.env.SEED_STARTING_BALANCE ?? 10000);

async function main() {
  const adminEmail = "monkeypaws65@gmail.com";
  const adminPasswordPlain = "babasaur34";
  const adminPassword = await hashPassword(adminPasswordPlain);
  const demoPassword = await hashPassword("demo1234");

  // Clean up any old admin test accounts
  await prisma.user.deleteMany({
    where: {
      role: "ADMIN",
      email: { not: adminEmail },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPassword,
      username: "admin-user",
    },
    create: {
      email: adminEmail,
      username: "admin-user",
      passwordHash: adminPassword,
      role: "ADMIN",
      wallet: { create: { balanceTokens: START_BALANCE } },
    },
    include: { wallet: true },
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@otakumarkets.test" },
    update: {},
    create: {
      email: "demo@otakumarkets.test",
      username: "demo-user",
      passwordHash: demoPassword,
      role: "USER",
      wallet: { create: { balanceTokens: START_BALANCE } },
    },
    include: { wallet: true },
  });
  let demoBalance = new Decimal(demo.wallet.balanceTokens);

  await prisma.series.createMany({
    data: [
      { title: "One Piece", type: "MANGA" },
      { title: "Naruto", type: "MANGA" },
      { title: "Jujutsu Kaisen", type: "ANIME" },
      { title: "Attack on Titan", type: "ANIME" },
      { title: "Chainsaw Man", type: "MANGA" },
      { title: "Spy x Family", type: "MANGA" },
      { title: "Demon Slayer", type: "ANIME" },
    ],
    skipDuplicates: true,
  });

  const seriesRecords = await prisma.series.findMany();
  const seriesByTitle = Object.fromEntries(seriesRecords.map((s) => [s.title, s.id]));

  await prisma.market.createMany({
    data: [
      {
        title: "Will Jujutsu Kaisen S2 Episode 15 air by 2025-03-01?",
        description: "Episode air date prediction for the Shibuya arc continuation.",
        category: "EPISODES",
        marketType: "YES_NO",
        resolutionDeadline: new Date("2025-03-01T00:00:00Z"),
        createdById: admin.id,
        relatedSeriesId: seriesByTitle["Jujutsu Kaisen"],
        status: "OPEN",
        isApproved: true,
      },
      {
        title: "Will Chainsaw Man Season 2 be announced before 2026?",
        description: "Anime adaptation rumor tracker.",
        category: "ADAPTATIONS",
        marketType: "YES_NO",
        resolutionDeadline: new Date("2025-12-31T00:00:00Z"),
        createdById: admin.id,
        relatedSeriesId: seriesByTitle["Chainsaw Man"],
        status: "OPEN",
        isApproved: true,
      },
      {
        title: "Which series will top the Oricon manga sales chart in May 2026?",
        description: "Multiple-choice sales crown.",
        category: "COMMUNITY",
        marketType: "MULTIPLE_CHOICE",
        resolutionDeadline: new Date("2026-05-31T00:00:00Z"),
        createdById: admin.id,
        status: "OPEN",
        isApproved: true,
      },
      {
        title: "Will One Piece Chapter 1200 introduce a new Yonko?",
        description: "Speculation on the power balance of the seas.",
        category: "CHAPTERS",
        marketType: "YES_NO",
        resolutionDeadline: new Date("2026-01-15T00:00:00Z"),
        createdById: admin.id,
        relatedSeriesId: seriesByTitle["One Piece"],
        status: "OPEN",
        isApproved: true,
      },
    ],
  });

  const createdMarkets = await prisma.market.findMany({ include: { options: true } });

  // Attach options for multi-choice and YES/NO (if missing)
  for (const market of createdMarkets) {
    if (market.marketType === "MULTIPLE_CHOICE") {
      await prisma.marketOption.createMany({
        data: [
          { marketId: market.id, label: "One Piece", order: 0 },
          { marketId: market.id, label: "Blue Lock", order: 1 },
          { marketId: market.id, label: "Jujutsu Kaisen", order: 2 },
          { marketId: market.id, label: "Chainsaw Man", order: 3 },
        ],
      });
    } else if (market.options.length === 0) {
      await prisma.marketOption.createMany({
        data: [
          { marketId: market.id, label: "Yes", order: 0 },
          { marketId: market.id, label: "No", order: 1 },
        ],
      });
    }
  }

  const demoMarkets = await prisma.market.findMany({ include: { options: true } });

  // Seed a few bets for demo user
  for (const market of demoMarkets.slice(0, 2)) {
    const option = market.options.find((o) => o.label === "Yes") ?? market.options[0];
    await prisma.bet.create({
      data: {
        userId: demo.id,
        marketId: market.id,
        optionId: option?.id,
        side: market.marketType === "YES_NO" ? "YES" : "OPTION",
        amountTokens: new Decimal(250),
        status: "OPEN",
      },
    });
    demoBalance = demoBalance.minus(new Decimal(250));
    await prisma.wallet.update({
      where: { userId: demo.id },
      data: { balanceTokens: demoBalance },
    });
    await prisma.transaction.create({
      data: {
        userId: demo.id,
        walletId: demo.wallet.id,
        type: "DEBIT",
        reason: "BET_PLACED",
        amountTokens: new Decimal(250),
        balanceAfter: demoBalance,
        description: `Seed bet on ${market.title}`,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
