//@ts-nocheck
import { getServerSession } from "next-auth/next"; // ✅ CORRECT
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";

const ALLOWED_ROLES = ["MAIN_ADMIN", "REGISTRAR_ADMIN"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 const session = await getServerSession(authOptions);


  if (!session) {
    redirect("/admin/login");
  }

  if (!ALLOWED_ROLES.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
