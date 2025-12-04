import Link from "next/link";
import { Hero } from "@/components/hero";
import { MarketCard } from "@/components/market-card";
import { listMarkets } from "@/modules/markets/service";

export default async function Home() {
  const markets = await listMarkets({ sort: "closingSoon", take: 6, skip: 0 });

  return (
    <div className="space-y-8">
      <Hero />
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Featured</p>
            <h2 className="text-2xl font-semibold text-white">Trending markets</h2>
          </div>
          <Link className="text-sm font-semibold text-indigo-200 hover:text-white" href="/markets">
            View all →
          </Link>
        </div>
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
      </section>
    </div>
  );
}
