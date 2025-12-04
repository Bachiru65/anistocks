"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.error?.message ?? "Signup failed");
        return;
      }
      setMessage("Account created! Redirecting...");
      setTimeout(() => router.push("/markets"), 500);
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Join the market</p>
        <h1 className="text-3xl font-bold text-white">Sign up</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </div>
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
          {isPending ? "Creating..." : "Create account"}
        </button>
      </form>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}
    </div>
  );
}
