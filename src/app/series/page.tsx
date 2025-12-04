import { listSeries } from "@/modules/markets/series";
import { searchAniList } from "@/modules/series/sources";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const [localSeries, externalSeries] = await Promise.all([
    listSeries({ type: undefined, q: undefined }),
    searchAniList("anime", 16).catch(() => []),
  ]);

  const merged = [
    ...localSeries.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type,
      synopsis: s.synopsis ?? undefined,
      source: "Local",
    })),
    ...externalSeries.map((s) => ({
      id: `ani-${s.id}`,
      title: s.title.english || s.title.romaji || s.title.native || "Unknown",
      type: s.format ?? "ANIME",
      synopsis: `Genres: ${(s.genres || []).slice(0, 3).join(", ")}`,
      source: "AniList",
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Browse</p>
        <h1 className="text-3xl font-bold text-white">Series</h1>
        <p className="text-slate-300">Local catalog plus AniList popular picks.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {merged.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-slate-400">{item.type}</p>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300">{item.source}</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            {item.synopsis ? <p className="mt-2 line-clamp-2">{item.synopsis}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
