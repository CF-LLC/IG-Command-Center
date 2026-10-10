import Link from "next/link";
import { currentUser, logout } from "@/lib/actions";
import { readDB } from "@/lib/store";

const NAV = [
  ["Dashboard", "/dashboard"],
  ["Calendar", "/calendar"],
  ["Composer", "/composer"],
  ["Library", "/library"],
  ["Analytics", "/analytics"],
  ["Inbox", "/inbox"],
  ["Approvals", "/approvals"],
  ["Team", "/team"],
  ["Notifications", "/notifications"],
  ["Settings", "/settings"],
] as const;

export async function Shell({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const db = await readDB();
  const unread = db.notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-[#262b36] bg-[#0e1015] p-4">
        <div className="mb-6">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[#9aa3b2]">IG Command Center</div>
          <div className="text-lg font-semibold">Operations</div>
        </div>
        <nav className="grid gap-1 text-sm">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 hover:bg-[#181b23] flex justify-between">
              <span>{label}</span>
              {label === "Notifications" && unread > 0 && (
                <span className="text-[11px] bg-[#e8ff6b] text-black rounded-full px-2">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-8 text-xs text-[#9aa3b2]">
          {user ? (
            <form action={async () => { "use server"; await logout(); }}>
              <div className="mb-2">
                {user.name} · {user.role}
              </div>
              <button className="underline">Sign out</button>
            </form>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </div>
      </aside>
      <main className="p-5 md:p-8 max-w-6xl w-full">{children}</main>
    </div>
  );
}
