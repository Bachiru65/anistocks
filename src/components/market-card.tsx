import Link from "next/link";
import { format } from "date-fns";

type MarketCardProps = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: string;
  totalStake?: number | string;
  resolutionDeadline: string | Date;
  seriesTitle?: string | null;
};

export function MarketCard({
  id,
  title,
  description,
  category,
  status,
  totalStake,
  resolutionDeadline,
  seriesTitle,
}: MarketCardProps) {
  const statusColor =
    status === "OPEN"
      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
      : status === "RESOLVED"
        ? "bg-indigo-500/20 text-indigo-100 border-indigo-400/40"
        : "bg-slate-700/50 text-slate-200 border-slate-500/50";

  return (
    <Link
      href={`/markets/${id}`}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">{category}</span>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusColor}`}>{status}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      {seriesTitle ? <p className="mt-1 text-sm text-slate-300">Series: {seriesTitle}</p> : null}
      <p className="mt-2 line-clamp-2 text-sm text-slate-300">{description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] uppercase tracking-tight text-slate-200">
            Closes {format(resolutionDeadline, "MMM d, yyyy")}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase text-slate-400">Total Pool</p>
          <p className="text-sm font-semibold text-white">{Number(totalStake ?? 0).toLocaleString()} tokens</p>
        </div>
      </div>
    </Link>
  );
}
