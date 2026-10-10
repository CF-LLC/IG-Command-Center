import { Shell } from "@/components/shell";
import { currentUser, getDashboard } from "@/lib/actions";
import { redirect } from "next/navigation";
import { ComposerForm } from "./composer-form";

export default async function ComposerPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();
  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Post composer</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Write once, target one or many accounts. AI caption uses OpenAI when a key is present.</p>
      <ComposerForm accounts={db.accounts} library={db.library} />
    </Shell>
  );
}
