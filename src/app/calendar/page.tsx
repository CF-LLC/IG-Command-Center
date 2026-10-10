import { Shell } from "@/components/shell";
import { currentUser, getDashboard, publishPost } from "@/lib/actions";
import { when } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startPad + days }, (_, i) => {
    if (i < startPad) return null;
    return i - startPad + 1;
  });

  function postsOn(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return db.posts.filter((p) => (p.scheduledAt || p.publishedAt || p.createdAt).startsWith(key));
  }

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Content calendar</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">
        {now.toLocaleString("en-US", { month: "long", year: "numeric" })} · color-coded by status
      </p>
      <div className="grid grid-cols-7 gap-2 text-xs mb-8">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-[#9aa3b2] px-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="card min-h-24 p-2">
            {day && (
              <>
                <div className="text-[#9aa3b2] mb-1">{day}</div>
                <div className="space-y-1">
                  {postsOn(day).map((p) => (
                    <div key={p.id} className={`rounded px-1 py-0.5 truncate status-${p.status}`}>
                      {p.caption.slice(0, 28)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <h2 className="font-medium mb-3">Scheduled queue</h2>
      <div className="space-y-2">
        {db.posts
          .filter((p) => ["scheduled", "approved"].includes(p.status))
          .map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <span className={`chip status-${p.status}`}>{p.status}</span>
              <div className="flex-1 text-sm">{p.caption}</div>
              <div className="text-xs text-[#9aa3b2]">{when(p.scheduledAt)}</div>
              <form action={async () => { "use server"; await publishPost(p.id); }}>
                <button className="text-sm underline">Publish now</button>
              </form>
            </div>
          ))}
      </div>
    </Shell>
  );
}
