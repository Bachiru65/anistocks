import Link from "next/link";
import { Hero } from "@/components/hero";
import { MarketCard } from "@/components/market-card";
import { listMarkets } from "@/modules/markets/service";
import { getSessionFromRequest } from "@/lib/session";
import { getProfile } from "@/modules/auth/service";
import { getUserPositions } from "@/modules/users/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const markets = await listMarkets({ sort: "closingSoon", take: 20, skip: 0 });
  const displayMarkets =
    markets.length >= 12 ? markets : [...markets, ...markets, ...markets].slice(0, 12);
  const session = await getSessionFromRequest();
  const profile = session ? await getProfile(session) : null;
  const positions = session ? await getUserPositions(session.userId) : [];

  return (
    <div className="space-y-8">
      <Hero user={profile ? { username: profile.username, balance: profile.wallet?.balanceTokens.toString() } : undefined} />
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
          {displayMarkets.map((market, idx) => (
            <MarketCard
              key={`${market.id}-${idx}`}
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
      {session ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your activity</h3>
            <Link className="text-sm font-semibold text-indigo-200 hover:text-white" href="/profile">
              Go to profile →
            </Link>
          </div>
          {positions.length === 0 ? (
            <p className="text-slate-300">No open positions yet. Place your first bet to see it here.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {positions.slice(0, 4).map((pos) => (
                <div key={pos.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <p className="text-xs uppercase text-slate-400">{pos.market.category}</p>
                  <Link href={`/markets/${pos.marketId}`} className="text-base font-semibold text-white hover:text-indigo-200">
                    {pos.market.title}
                  </Link>
                  <p className="text-xs text-slate-400">
                    Stake: {pos.amountTokens.toString()} · Outcome: {pos.option?.label ?? pos.side}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
