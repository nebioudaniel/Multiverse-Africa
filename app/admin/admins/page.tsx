// app/admin/admins/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/ui/data-table";
import { createAdminColumns, AdminUser } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CreateAdminDialog from "./create-admin-dialog"; // Import the new dialog component

const AdminListPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const { data: session, status } = useSession();

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/admins");
      if (!response.ok) {
        throw new Error("Failed to fetch administrators.");
      }
      const data = await response.json();
      setAdmins(data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load administrators.", {
        description: "An unexpected error occurred while fetching the data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // FIX 1: Accessing custom 'role' property requires type assertion
    if (status === "authenticated" && (session?.user as any)?.role === "MAIN_ADMIN") {
      fetchAdmins();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // FIX 2: Accessing custom 'role' property requires type assertion
  if (status === "unauthenticated" || (session?.user as any)?.role !== "MAIN_ADMIN") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] p-4">
        <div className="text-center p-8 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-700">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // FIX 3: Cast session.user to 'any' for the column creation function call
const columns = createAdminColumns(
  (session?.user as any)?.id || "", // Applied (session?.user as any)? to include 'id'
  (session?.user as any)?.role || "REGISTRAR_ADMIN", // fallback role
  fetchAdmins
);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administrators</h1>
        {/* The 'Add New Admin' button now opens the dialog */}
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Admin
        </Button>
      </div>
      <Separator className="mb-6" />
      <DataTable columns={columns} data={admins || []} filterColumnId="fullName" />

      {/* The new dialog component is rendered here */}
      <CreateAdminDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          fetchAdmins(); // Refresh the list after success
          setIsDialogOpen(false); // Close the dialog
        }}
      />
    </div>
  );
};

export default AdminListPage;