"use client";

import { useState } from "react";
import { replyComment, suggestReply } from "@/lib/actions";
import type { Account, Comment } from "@/lib/types";
import { when } from "@/lib/format";

export function InboxClient({ comments, accounts }: { comments: Comment[]; accounts: Account[] }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-3">
      {comments.map((c) => {
        const account = accounts.find((a) => a.id === c.accountId);
        return (
          <div key={c.id} className="card p-4">
            <div className="flex justify-between text-xs text-[#9aa3b2] mb-2">
              <span>{account?.handle} · {c.author}</span>
              <span>{when(c.createdAt)}</span>
            </div>
            <p className="text-sm mb-3">{c.text}</p>
            {c.replied ? (
              <div className="text-sm text-[#8ee7b8]">Reply: {c.replyText}</div>
            ) : (
              <form
                className="flex gap-2"
                action={async (fd) => {
                  await replyComment(c.id, String(fd.get("text")));
                }}
              >
                <input
                  name="text"
                  value={drafts[c.id] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                  className="flex-1 rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2 text-sm"
                  placeholder="Reply…"
                />
                <button className="rounded-lg bg-[#e8ff6b] text-black px-3 text-sm">Send</button>
                <button
                  type="button"
                  className="rounded-lg border border-[#262b36] px-3 text-sm"
                  onClick={async () => {
                    const res = await suggestReply(c.text);
                    setDrafts((d) => ({ ...d, [c.id]: res.text }));
                  }}
                >
                  AI reply
                </button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
