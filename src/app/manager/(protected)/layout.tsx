import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
import { ManagerMobileNav } from "@/components/manager/manager-mobile-nav";
import { ManagerTopbar } from "@/components/manager/manager-topbar";

export default async function ManagerProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "MANAGER" && session.user.role !== "TEAM") {
    redirect("/");
  }

  const role = session.user.role;
  const name = session.user.name ?? session.user.email ?? "Manager";

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar role={role} />
      <div className="flex flex-1 flex-col">
        <ManagerTopbar name={name} role={role} />
        <ManagerMobileNav role={role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
