"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.error?.message ?? "Login failed");
        return;
      }
      setMessage("Logged in! Redirecting...");
      setTimeout(() => router.push("/markets"), 500);
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Welcome back</p>
        <h1 className="text-3xl font-bold text-white">Log in</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-indigo-400 hover:to-pink-400 disabled:opacity-60"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
      </form>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}
      <p className="text-xs text-slate-400">
        Demo: demo@otakumarkets.test / demo1234 | Admin: admin@otakumarkets.test / admin1234
      </p>
    </div>
  );
}
