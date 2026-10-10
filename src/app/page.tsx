import { currentUser } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  redirect(user ? "/dashboard" : "/login");
}
