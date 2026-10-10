import { Shell } from "@/components/shell";
import { currentUser, getDashboard } from "@/lib/actions";
import { redirect } from "next/navigation";
import { InboxClient } from "./inbox-client";

export default async function InboxPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Comments inbox</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Unified comments across every connected account.</p>
      <InboxClient comments={db.comments} accounts={db.accounts} />
    </Shell>
  );
}
