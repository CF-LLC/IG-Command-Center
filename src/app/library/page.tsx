import { Shell } from "@/components/shell";
import { addLibraryItem, currentUser, getDashboard } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Content library</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Captions, hashtag sets, hooks, CTAs, campaign assets.</p>
      <form
        className="card p-4 mb-6 grid md:grid-cols-5 gap-3"
        action={async (fd) => {
          "use server";
          await addLibraryItem({
            kind: String(fd.get("kind")) as "caption" | "hashtags" | "hook" | "cta" | "asset",
            title: String(fd.get("title")),
            body: String(fd.get("body")),
            tags: String(fd.get("tags") || ""),
            campaign: String(fd.get("campaign") || "") || undefined,
          });
        }}
      >
        <select name="kind" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2">
          <option value="caption">caption</option>
          <option value="hashtags">hashtags</option>
          <option value="hook">hook</option>
          <option value="cta">cta</option>
          <option value="asset">asset</option>
        </select>
        <input name="title" placeholder="Title" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
        <input name="body" placeholder="Body" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
        <input name="tags" placeholder="tags, comma" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
        <button className="rounded-lg bg-[#e8ff6b] text-black">Add</button>
      </form>
      <div className="grid md:grid-cols-2 gap-3">
        {db.library.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex justify-between text-xs text-[#9aa3b2] mb-2">
              <span className="uppercase tracking-wide">{item.kind}</span>
              {item.campaign && <span>{item.campaign}</span>}
            </div>
            <div className="font-medium">{item.title}</div>
            <p className="text-sm text-[#9aa3b2] mt-2 whitespace-pre-wrap">{item.body}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
