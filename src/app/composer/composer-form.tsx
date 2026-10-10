"use client";

import { useState } from "react";
import { createPost, generateCaption } from "@/lib/actions";
import type { Account, LibraryItem } from "@/lib/types";

export function ComposerForm({
  accounts,
  library,
}: {
  accounts: Account[];
  library: LibraryItem[];
}) {
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <form
      className="grid md:grid-cols-3 gap-6"
      action={async (fd) => {
        const accountIds = fd.getAll("accounts").map(String);
        const res = await createPost({
          accountIds,
          caption: String(fd.get("caption") || caption),
          mediaUrl: String(fd.get("mediaUrl") || ""),
          mediaType: String(fd.get("mediaType") || "image") as "image" | "carousel" | "reel",
          scheduledAt: String(fd.get("scheduledAt") || "") || undefined,
          submit: fd.get("intent") === "submit",
        });
        setMsg(res.ok ? "Saved." : res.error || "Failed");
      }}
    >
      <div className="md:col-span-2 card p-5 space-y-4">
        <label className="block text-sm">
          Accounts
          <div className="mt-2 flex flex-wrap gap-2">
            {accounts.map((a) => (
              <label key={a.id} className="chip cursor-pointer">
                <input type="checkbox" name="accounts" value={a.id} defaultChecked={a.id === accounts[0]?.id} />
                {a.handle}
              </label>
            ))}
          </div>
        </label>
        <label className="block text-sm">
          Media URL
          <input name="mediaUrl" placeholder="https://..." className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
        </label>
        <label className="block text-sm">
          Type
          <select name="mediaType" className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2">
            <option value="image">Image</option>
            <option value="carousel">Carousel</option>
            <option value="reel">Reel</option>
          </select>
        </label>
        <label className="block text-sm">
          Caption
          <textarea
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Schedule
          <input type="datetime-local" name="scheduledAt" className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
        </label>
        <div className="flex gap-2">
          <button name="intent" value="draft" className="rounded-lg border border-[#262b36] px-4 py-2">Save draft</button>
          <button name="intent" value="submit" className="rounded-lg bg-[#e8ff6b] text-black px-4 py-2">Submit for approval</button>
          <button
            type="button"
            disabled={busy}
            className="rounded-lg border border-[#262b36] px-4 py-2"
            onClick={async () => {
              setBusy(true);
              const voice = library.find((l) => l.kind === "asset")?.body;
              const res = await generateCaption(caption || "Studio product still, spring light", voice);
              if (res.text) setCaption(res.text);
              setBusy(false);
            }}
          >
            {busy ? "Writing…" : "AI caption"}
          </button>
        </div>
        {msg && <p className="text-sm text-[#9aa3b2]">{msg}</p>}
      </div>
      <aside className="card p-5 space-y-3">
        <div className="text-sm font-medium">Library inserts</div>
        {library.map((item) => (
          <button
            type="button"
            key={item.id}
            className="block w-full text-left text-sm rounded-lg border border-[#262b36] p-3 hover:bg-[#181b23]"
            onClick={() => setCaption((c) => (c ? `${c}\n\n${item.body}` : item.body))}
          >
            <div className="text-[11px] uppercase tracking-wide text-[#9aa3b2]">{item.kind}</div>
            {item.title}
          </button>
        ))}
      </aside>
    </form>
  );
}
