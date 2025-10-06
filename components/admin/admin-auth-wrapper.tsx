"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import CustomLoader from "@/components/ui/custom-loader";
import AdminLayout from "@/components/layout/admin-layout";

interface AdminAuthWrapperProps {
  children: ReactNode;
}

const ALLOWED_ADMIN_ROLES = ["MAIN_ADMIN", "REGISTRAR_ADMIN"];

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdminRoute) return;

    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/admin/login");
    }

    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (!ALLOWED_ADMIN_ROLES.includes(role)) {
        router.replace("/admin/login?error=unauthorized");
      } else if (isLoginPage) {
        router.replace("/admin/dashboard");
      }
    }
  }, [status, session, pathname]);

  if (status === "loading") {
    return <CustomLoader message="Verifying authentication..." />;
  }

  if (isLoginPage || (session && ALLOWED_ADMIN_ROLES.includes((session.user as any).role))) {
    return <>{children}</>;
  }

  return <CustomLoader message="Preparing admin panel..." />;
}
