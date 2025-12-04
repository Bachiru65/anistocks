import { redirect } from "next/navigation";
import { getSessionFromRequest } from "@/lib/session";
import { getProfile } from "@/modules/auth/service";
import { getUserPositions, getUserTransactions } from "@/modules/users/service";

export default async function ProfilePage() {
  const session = await getSessionFromRequest();
  if (!session) redirect("/auth/login");

  const user = await getProfile(session);
  const positions = await getUserPositions(session.userId);
  const transactions = await getUserTransactions(session.userId, 10);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Profile</p>
        <h1 className="text-3xl font-bold text-white">{user.username}</h1>
        <p className="text-slate-300">Balance: {user.wallet?.balanceTokens.toString()} tokens</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Open positions</h2>
        {positions.length === 0 ? (
          <p className="text-slate-300">No open positions yet.</p>
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => (
              <div key={pos.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                <p className="font-semibold text-white">{pos.market.title}</p>
                <p className="text-xs text-slate-400">
                  Stake: {pos.amountTokens.toString()} | Outcome: {pos.option?.label ?? pos.side}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Recent transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-slate-300">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <div>
                  <p className="font-semibold text-white">{tx.reason}</p>
                  <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{tx.type === "CREDIT" ? "+" : "-"}{tx.amountTokens.toString()}</p>
                  <p className="text-xs text-slate-400">After: {tx.balanceAfter.toString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
