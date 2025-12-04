import Link from "next/link";

type HeroProps = {
  user?: { username: string; balance?: string };
};

export function Hero({ user }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-12 shadow-2xl sm:px-10 sm:py-16">
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Anime & Manga Predictions
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {user ? (
              <>
                Welcome back, {user.username}.
                <span className="block bg-gradient-to-r from-indigo-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                  Ready for the next call?
                </span>
              </>
            ) : (
              <>
                Trade the future of your favorite series.
                <span className="block bg-gradient-to-r from-indigo-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                  OtakuMarkets
                </span>
              </>
            )}
          </h1>
          <p className="max-w-xl text-base text-slate-200 sm:text-lg">
            Stake demo tokens on anime and manga outcomes, track probabilities, and settle disputes with transparent
            payouts. Inspired by Polymarket, remixed for otaku culture.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/markets"
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-400 hover:to-pink-400"
            >
              Browse markets
            </Link>
            {user ? (
              <Link
                href="/profile"
                className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                View positions
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Create an account
              </Link>
            )}
          </div>
          {user?.balance ? (
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-indigo-100">
                Balance
              </span>
              <span className="font-semibold text-white">{user.balance} demo tokens</span>
            </div>
          ) : null}
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between text-sm text-slate-200">
            <span>Trending markets</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Live</span>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              "Will JJK S2 E15 air by Mar 2025?",
              "Will One Piece Ch.1200 introduce a new Yonko?",
              "Who tops Oricon sales in May 2026?",
            ].map((title) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-slate-100"
              >
                <span className="max-w-[70%] truncate">{title}</span>
                <span className="text-xs text-emerald-200">open</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-slate-400">Demo tokens only. Safe space to speculate.</p>
        </div>
      </div>
    </section>
  );
}
