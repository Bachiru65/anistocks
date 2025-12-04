"use client";

import { useState, useTransition } from "react";

type BetFormProps = {
  marketId: string;
  marketType: "YES_NO" | "MULTIPLE_CHOICE" | "NUMERIC";
  options: { id: string; label: string }[];
  isAuthed?: boolean;
};

export function BetForm({ marketId, marketType, options, isAuthed }: BetFormProps) {
  const [amount, setAmount] = useState(100);
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [optionId, setOptionId] = useState<string | undefined>(options[0]?.id);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const payload =
        marketType === "MULTIPLE_CHOICE" ? { amount, optionId } : { amount, side };
      const res = await fetch(`/api/markets/${marketId}/bet`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.error?.message ?? "Could not place bet");
        return;
      }
      setMessage("Bet placed! Check your positions.");
    });
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Place a bet</h4>
        <span className="text-[11px] uppercase text-slate-400">demo tokens</span>
      </div>
      {marketType === "YES_NO" ? (
        <div className="grid grid-cols-2 gap-2">
          {(["YES", "NO"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSide(value)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                side === value
                  ? "border-indigo-400 bg-indigo-500/20 text-white"
                  : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-slate-300">Pick an outcome</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setOptionId(option.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                  optionId === option.id
                    ? "border-indigo-400 bg-indigo-500/20 text-white"
                    : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200">Amount</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-indigo-400"
        />
        <div className="flex flex-wrap gap-2 text-xs">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              className="rounded-full border border-white/15 px-3 py-1 text-slate-200 transition hover:border-white/40 hover:text-white"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending || !isAuthed}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-400 hover:to-pink-400 disabled:opacity-60"
      >
        {isAuthed ? (isPending ? "Placing..." : "Place bet") : "Log in to bet"}
      </button>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}
    </form>
  );
}
