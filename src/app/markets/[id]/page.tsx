import { BetForm } from "@/components/bet-form";
import { MarketChart } from "@/components/market-chart";
import { MarketCard } from "@/components/market-card";
import { AppError } from "@/lib/errors";
import { getMarketById } from "@/modules/markets/service";
import Link from "next/link";

type Params = { params: Promise<{ id: string }> };

export default async function MarketDetailPage({ params }: Params) {
  const { id } = await params;
  if (!id) throw new AppError("VALIDATION_ERROR", "Market id required", 400);
  const market = await getMarketById(id);
  const related = market.relatedSeries;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-400">{market.category}</p>
        <h1 className="text-3xl font-bold text-white">{market.title}</h1>
        {related ? (
          <Link href="/series" className="text-sm text-indigo-200 hover:text-white">
            {related.title}
          </Link>
        ) : null}
        <p className="max-w-3xl text-slate-200">{market.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <MarketChart />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Outcome options</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {market.options.map((option) => (
                <span key={option.id} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
                  {option.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <BetForm
            marketId={market.id}
            marketType={market.marketType as "YES_NO" | "MULTIPLE_CHOICE" | "NUMERIC"}
            options={market.options.map((o) => ({ id: o.id, label: o.label }))}
          />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Resolution</p>
            <p className="mt-2">
              Deadline: {new Date(market.resolutionDeadline).toLocaleString()} <br />
              Status: {market.status}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">You might also like</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <MarketCard
            id={market.id}
            title={market.title}
            description={market.description}
            category={market.category}
            status={market.status}
            totalStake={Number(market.totalStake)}
            resolutionDeadline={market.resolutionDeadline}
            seriesTitle={related?.title}
          />
        </div>
      </div>
    </div>
  );
}
