"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/series", label: "Series" },
  { href: "/leaderboard", label: "Leaderboard", disabled: true },
  { href: "/admin/markets", label: "Admin", hint: "admins" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-sm font-bold text-white shadow-lg">
            OM
          </span>
          <span className="bg-gradient-to-r from-indigo-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
            OtakuMarkets
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-200">
          {links.map((link) => (
            <Link
              key={link.href}
              aria-disabled={link.disabled}
              className={clsx(
                "rounded-lg px-3 py-2 transition",
                link.disabled && "cursor-not-allowed opacity-40",
                pathname.startsWith(link.href)
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
              href={link.disabled ? "#" : link.href}
            >
              {link.label}
              {link.hint ? <span className="ml-1 text-xs text-slate-400">({link.hint})</span> : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/auth/login"
            className="rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-white shadow-lg transition hover:from-indigo-400 hover:to-pink-400"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
