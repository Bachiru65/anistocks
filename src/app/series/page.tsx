import { listSeries } from "@/modules/markets/series";

export default async function SeriesPage() {
  const series = await listSeries({ type: undefined, q: undefined });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Browse</p>
        <h1 className="text-3xl font-bold text-white">Series</h1>
        <p className="text-slate-300">Find anime and manga tied to active markets.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {series.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow"
          >
            <p className="text-xs uppercase text-slate-400">{item.type}</p>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            {item.synopsis ? <p className="mt-2 line-clamp-2">{item.synopsis}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
