import { Shell } from "@/components/shell";
import { currentUser, getDashboard } from "@/lib/actions";
import { n } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  const scheduled = db.posts.filter((p) => p.status === "scheduled").length;
  const pending = db.posts.filter((p) => p.status === "submitted").length;
  const followers = db.accounts.reduce((s, a) => s + a.followers, 0);
  const reach = db.accounts.reduce((s, a) => s + a.reach30d, 0);

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Multi-account overview</h1>
      <p className="text-[#9aa3b2] mb-6 text-sm">All connected profiles in one command surface.</p>
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        {[
          ["Followers", n(followers)],
          ["30-day reach", n(reach)],
          ["Scheduled", String(scheduled)],
          ["Awaiting approval", String(pending)],
        ].map(([k, v]) => (
          <div key={k} className="card p-4">
            <div className="text-xs text-[#9aa3b2]">{k}</div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {db.accounts.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[#7c5cff] grid place-items-center text-sm font-semibold">{a.avatar}</div>
              <div>
                <div className="font-medium">{a.displayName}</div>
                <div className="text-xs text-[#9aa3b2]">{a.handle}</div>
              </div>
              <span className="ml-auto chip">{a.connected ? "connected" : "offline"}</span>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>Followers<div className="text-[#9aa3b2]">{n(a.followers)}</div></div>
              <div>Engagement<div className="text-[#9aa3b2]">{a.engagementRate}%</div></div>
              <div>Reach 30d<div className="text-[#9aa3b2]">{n(a.reach30d)}</div></div>
              <div>Scheduled<div className="text-[#9aa3b2]">{db.posts.filter((p) => p.accountIds.includes(a.id) && p.status === "scheduled").length}</div></div>
            </dl>
          </div>
        ))}
      </div>
    </Shell>
  );
}
