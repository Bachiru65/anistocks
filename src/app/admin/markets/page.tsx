import { redirect } from "next/navigation";
import { getSessionFromRequest } from "@/lib/session";
import { listMarkets } from "@/modules/markets/service";

export default async function AdminMarketsPage() {
  const session = await getSessionFromRequest();
  if (!session || session.role !== "ADMIN") redirect("/auth/login");

  const markets = await listMarkets({ take: 50, skip: 0 }, session);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Admin</p>
        <h1 className="text-3xl font-bold text-white">Market control</h1>
        <p className="text-slate-300">Approve or resolve markets.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Approved</th>
              <th className="px-4 py-3 text-left font-semibold">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {markets.map((market) => (
              <tr key={market.id} className="bg-white/[0.02]">
                <td className="px-4 py-3 text-white">{market.title}</td>
                <td className="px-4 py-3 text-slate-200">{market.status}</td>
                <td className="px-4 py-3 text-slate-200">{market.isApproved ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-slate-200">
                  {new Date(market.resolutionDeadline).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
