import { Shell } from "@/components/shell";
import { currentUser, getDashboard } from "@/lib/actions";
import { n } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { account?: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  const accountId = searchParams.account || db.accounts[0]?.id;
  const account = db.accounts.find((a) => a.id === accountId) ?? db.accounts[0];
  const series = db.analytics[account.id] ?? [];
  const maxReach = Math.max(...series.map((p) => p.reach), 1);

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Analytics</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Cross-account comparison and single-account drilldown.</p>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {db.accounts.map((a) => (
          <a key={a.id} href={`/analytics?account=${a.id}`} className={`card p-4 ${a.id === account.id ? "ring-1 ring-[#e8ff6b]" : ""}`}>
            <div className="font-medium">{a.displayName}</div>
            <div className="text-xs text-[#9aa3b2] mb-3">{a.handle}</div>
            <div className="text-sm">Followers {n(a.followers)}</div>
            <div className="text-sm">Engagement {a.engagementRate}%</div>
            <div className="text-sm">Reach {n(a.reach30d)}</div>
          </a>
        ))}
      </div>
      <div className="card p-5">
        <div className="mb-4 font-medium">{account.displayName} · 30-day reach</div>
        <div className="flex items-end gap-1 h-40">
          {series.map((p) => (
            <div
              key={p.date}
              title={`${p.date}: ${p.reach}`}
              className="flex-1 bg-[#7c5cff] rounded-t"
              style={{ height: `${(p.reach / maxReach) * 100}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6 text-sm">
          <div>Latest followers<div className="text-[#9aa3b2]">{n(series.at(-1)?.followers ?? account.followers)}</div></div>
          <div>Engagement<div className="text-[#9aa3b2]">{series.at(-1)?.engagement}%</div></div>
          <div>Impressions<div className="text-[#9aa3b2]">{n(series.at(-1)?.impressions ?? 0)}</div></div>
          <div>Reach<div className="text-[#9aa3b2]">{n(series.at(-1)?.reach ?? 0)}</div></div>
        </div>
      </div>
    </Shell>
  );
}
