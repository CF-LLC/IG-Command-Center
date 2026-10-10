import { Shell } from "@/components/shell";
import {
  connectInstagramAccount,
  currentUser,
  disconnectInstagramAccount,
  getDashboard,
  getRuntimeConfig,
  syncInstagramAccount,
} from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  const runtime = await getRuntimeConfig();

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">
        Production configuration. Connect real Instagram Business/Creator accounts with a
        long-lived Page access token from Meta.
      </p>

      <div className="grid gap-3 mb-8">
        <div className="card p-4">
          <div className="font-medium">Signed in</div>
          <div className="text-sm text-[#9aa3b2]">
            {user.name} · {user.email} · {user.role}
          </div>
        </div>
        <div className="card p-4">
          <div className="font-medium">OpenAI</div>
          <div className="text-sm text-[#9aa3b2]">
            {runtime.openai
              ? "Connected — captions and replies use the API."
              : "Not set — local fallback copy is used."}
          </div>
          <code className="text-xs text-[#9aa3b2] block mt-2">OPENAI_API_KEY</code>
        </div>
        <div className="card p-4">
          <div className="font-medium">Runtime</div>
          <div className="text-sm text-[#9aa3b2]">
            {runtime.nodeEnv}
            {runtime.netlify ? " · Netlify" : ""}
            {runtime.igEnv ? " · global IG env present" : ""}
          </div>
        </div>
      </div>

      <h2 className="font-medium mb-3">Connected Instagram accounts</h2>
      <div className="grid gap-3 mb-8">
        {db.accounts.map((a) => (
          <div key={a.id} className="card p-4 flex flex-wrap items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#7c5cff] grid place-items-center text-sm font-semibold">
              {a.avatar}
            </div>
            <div className="flex-1 min-w-[160px]">
              <div className="font-medium">{a.displayName}</div>
              <div className="text-xs text-[#9aa3b2]">
                {a.handle}
                {a.igUserId ? ` · IG ${a.igUserId}` : ""}
                {a.lastSyncedAt ? ` · synced ${new Date(a.lastSyncedAt).toLocaleString()}` : ""}
              </div>
            </div>
            <span className="chip">{a.connected && a.accessToken ? "live token" : a.connected ? "connected" : "offline"}</span>
            {a.connected && a.accessToken && (
              <>
                <form
                  action={async () => {
                    "use server";
                    await syncInstagramAccount(a.id);
                  }}
                >
                  <button className="text-sm underline">Sync</button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await disconnectInstagramAccount(a.id);
                  }}
                >
                  <button className="text-sm underline text-[#ff6b7a]">Disconnect</button>
                </form>
              </>
            )}
          </div>
        ))}
      </div>

      {(user.role === "Admin" || user.role === "Approver") && (
        <>
          <h2 className="font-medium mb-3">Connect real account</h2>
          <p className="text-sm text-[#9aa3b2] mb-3">
            Meta requirements: Instagram professional account linked to a Facebook Page,
            app with Instagram Graph permissions, long-lived Page token. Image publish
            needs a publicly reachable media URL.
          </p>
          <form
            className="card p-4 grid gap-3 max-w-xl"
            action={async (fd) => {
              "use server";
              await connectInstagramAccount({
                igUserId: String(fd.get("igUserId") || ""),
                accessToken: String(fd.get("accessToken") || ""),
              });
            }}
          >
            <label className="block text-sm">
              Instagram Business user id
              <input
                name="igUserId"
                required
                placeholder="17841…"
                className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Long-lived Page access token
              <input
                name="accessToken"
                required
                type="password"
                placeholder="EAAB…"
                className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2"
              />
            </label>
            <button className="rounded-lg bg-[#e8ff6b] text-black font-medium py-2">
              Connect &amp; verify
            </button>
          </form>
        </>
      )}
    </Shell>
  );
}
