import { MarketCard } from "@/components/market-card";
import { listMarkets } from "@/modules/markets/service";
import type { ListMarketsInput } from "@/modules/markets/schema";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const categories = ["ALL", "EPISODES", "CHAPTERS", "ADAPTATIONS", "COMMUNITY"];

export default async function MarketsPage({ searchParams }: Props) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const markets = await listMarkets({
    category: category && category !== "ALL" ? (category as ListMarketsInput["category"]) : undefined,
    sort: "closingSoon",
    take: 24,
    skip: 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Explore</p>
          <h1 className="text-3xl font-bold text-white">Markets</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => {
            const href = cat === "ALL" ? "/markets" : `/markets?category=${cat}`;
            const active = category === cat || (!category && cat === "ALL");
            return (
              <a
                key={cat}
                href={href}
                className={`rounded-full border px-3 py-1 font-semibold transition ${
                  active
                    ? "border-indigo-400 bg-indigo-500/20 text-white"
                    : "border-white/15 bg-white/5 text-slate-200 hover:border-white/40"
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>
      </div>

      {markets.length === 0 ? (
        <p className="text-slate-300">No markets yet. Create one to get started.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {markets.map((market) => (
            <MarketCard
              key={market.id}
              id={market.id}
              title={market.title}
              description={market.description}
              category={market.category}
              status={market.status}
              totalStake={Number(market.totalStake)}
              resolutionDeadline={market.resolutionDeadline}
              seriesTitle={market.relatedSeries?.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
