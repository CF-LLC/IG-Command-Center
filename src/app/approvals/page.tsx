import { Shell } from "@/components/shell";
import { currentUser, getDashboard, reviewPost } from "@/lib/actions";
import { when } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function ApprovalsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  const queue = db.posts.filter((p) => ["draft", "submitted", "approved", "rejected"].includes(p.status));

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Approval workflow</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Draft → Submit → Approve / Reject. Editors cannot review.</p>
      <div className="space-y-3">
        {queue.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`chip status-${p.status}`}>{p.status}</span>
              <span className="text-xs text-[#9aa3b2]">{when(p.updatedAt)}</span>
            </div>
            <p className="text-sm mb-3">{p.caption}</p>
            {p.reviewNote && <p className="text-sm text-[#f7d27a] mb-3">{p.reviewNote}</p>}
            {p.status === "submitted" && user.role !== "Editor" && (
              <div className="flex gap-2">
                <form action={async () => { "use server"; await reviewPost(p.id, "approved"); }}>
                  <button className="rounded-lg bg-[#e8ff6b] text-black px-3 py-1 text-sm">Approve</button>
                </form>
                <form action={async () => { "use server"; await reviewPost(p.id, "rejected", "Needs revision."); }}>
                  <button className="rounded-lg border border-[#262b36] px-3 py-1 text-sm">Reject</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}
