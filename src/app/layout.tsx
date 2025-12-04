import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { getSessionFromRequest } from "@/lib/session";
import { getProfile } from "@/modules/auth/service";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OtakuMarkets | Anime & Manga Predictions",
  description: "Prediction markets for anime & manga outcomes using demo tokens.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionFromRequest();
  const profile = session ? await getProfile(session) : null;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-white antialiased`}>
        <Navbar
          currentUser={
            profile
              ? {
                  username: profile.username,
                  role: profile.role,
                  balance: profile.wallet?.balanceTokens.toString(),
                }
              : undefined
          }
        />
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
