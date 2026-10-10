import { Shell } from "@/components/shell";
import { addUser, currentUser, getDashboard, updateRole } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const db = await getDashboard();

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-1">Team</h1>
      <p className="text-sm text-[#9aa3b2] mb-6">Roles: Admin, Editor, Approver.</p>
      <div className="card overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="text-left text-[#9aa3b2] border-b border-[#262b36]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {db.users.map((u) => (
              <tr key={u.id} className="border-b border-[#262b36]">
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-[#9aa3b2]">{u.email}</td>
                <td className="p-3">
                  {user.role === "Admin" ? (
                    <form
                      action={async (fd) => {
                        "use server";
                        await updateRole(u.id, String(fd.get("role")) as "Admin" | "Editor" | "Approver");
                      }}
                    >
                      <select name="role" defaultValue={u.role} className="bg-[#181b23] border border-[#262b36] rounded px-2 py-1">
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Approver</option>
                      </select>
                      <button className="ml-2 text-xs underline">Save</button>
                    </form>
                  ) : (
                    u.role
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user.role === "Admin" && (
        <form
          className="card p-4 grid md:grid-cols-5 gap-3"
          action={async (fd) => {
            "use server";
            await addUser({
              name: String(fd.get("name")),
              email: String(fd.get("email")),
              password: String(fd.get("password")),
              role: String(fd.get("role")) as "Admin" | "Editor" | "Approver",
            });
          }}
        >
          <input name="name" placeholder="Name" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
          <input name="email" placeholder="Email" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
          <input name="password" placeholder="Password" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2" />
          <select name="role" className="rounded-lg bg-[#181b23] border border-[#262b36] px-3 py-2">
            <option>Editor</option>
            <option>Approver</option>
            <option>Admin</option>
          </select>
          <button className="rounded-lg bg-[#e8ff6b] text-black">Invite</button>
        </form>
      )}
    </Shell>
  );
}
