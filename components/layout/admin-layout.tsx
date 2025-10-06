"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "../ui/custom-loader";
import AdminLayout from "../layout/admin-layout";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [status, isLoginPage, router]);

  if (status === "loading") {
    return <CustomLoader message="Loading admin panel..." emoji="🛠️" />;
  }

  if (!session || !session.user) {
    if (isLoginPage) return <>{children}</>; // render login page
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
