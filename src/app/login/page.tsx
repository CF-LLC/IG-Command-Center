import { login } from "@/lib/actions";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        className="card w-full max-w-md p-6 space-y-4"
        action={async (fd) => {
          "use server";
          const res = await login(String(fd.get("email") || ""), String(fd.get("password") || ""));
          if (res.ok) redirect("/dashboard");
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold">IG Command Center</h1>
          <p className="text-sm text-[#9aa3b2] mt-1">Sign in to manage accounts from one place.</p>
        </div>
        <label className="block text-sm">
          Email
          <input
            name="email"
            defaultValue="cooper@local"
            className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            name="password"
            type="password"
            defaultValue="command"
            className="mt-1 w-full rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2"
          />
        </label>
        <button className="w-full rounded-lg bg-[#e8ff6b] text-black font-medium py-2">Sign in</button>
        <p className="text-xs text-[#9aa3b2]">Demo: cooper@local / command</p>
      </form>
    </main>
  );
}
