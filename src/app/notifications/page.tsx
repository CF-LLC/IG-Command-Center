import { Shell } from "@/components/shell";
import { currentUser, getDashboard, markNotificationsRead } from "@/lib/actions";
import { when } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-[#9aa3b2]">Approvals, publishes, failures, comments.</p>
        </div>
        <form action={async () => { "use server"; await markNotificationsRead(); }}>
          <button className="text-sm underline">Mark all read</button>
        </form>
      </div>
      <div className="space-y-2">
        {db.notifications.map((n) => (
          <a key={n.id} href={n.href || "#"} className="card p-4 block">
            <div className="flex justify-between text-xs text-[#9aa3b2]">
              <span className="uppercase tracking-wide">{n.type}</span>
              <span>{when(n.createdAt)} {n.read ? "" : "· new"}</span>
            </div>
            <div className="font-medium mt-1">{n.title}</div>
            <p className="text-sm text-[#9aa3b2]">{n.body}</p>
          </a>
        ))}
      </div>
    </Shell>
  );
}
