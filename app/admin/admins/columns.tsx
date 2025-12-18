// app/admin/admins/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table"; // FIX 1: Removed 'sortingFns'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, ShieldCheck, User, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { toast } from "sonner";

// Define roles as string literals for client-side use
enum ClientRole {
  MAIN_ADMIN = "MAIN_ADMIN",
  REGISTRAR_ADMIN = "REGISTRAR_ADMIN",
  APPLICANT = "APPLICANT",
}

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: ClientRole;
  createdAt: string;
  updatedAt: string;
  registeredBy: {
    id: string;
    fullName: string;
    email: string;
  } | null;
};

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    // Check if it's an object with a message property (e.g., from an API response via catch)
    if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
    }
    return "An unexpected error occurred.";
}


async function handleDeleteAdmin(
  adminId: string,
  currentAdminId: string | undefined,
  currentAdminRole: ClientRole | undefined,
  refetch: () => Promise<void>
) {
  if (!currentAdminId || currentAdminRole !== ClientRole.MAIN_ADMIN) {
    toast.error("Permission Denied", { description: "Only Main Admins can delete other admins." });
    return;
  }

  if (adminId === currentAdminId) {
    toast.error("Action Forbidden", { description: "You cannot delete your own account." });
    return;
  }

  toast.info("Deleting admin...", { id: `delete-${adminId}`, duration: 5000 });
  try {
    const response = await fetch(`/api/admin/admins/${adminId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete administrator.");
    }

    toast.success("Administrator deleted successfully!", { id: `delete-${adminId}` });
    refetch();
    return { success: true };
  } catch (err: unknown) { // FIX 2: Correctly using 'unknown'
    console.error("Delete Admin Error:", err);
    
    const errorMessage = getErrorMessage(err); // Using the type-safe helper function
            
    toast.error("Failed to delete administrator", {
      description: errorMessage, // Use the extracted message
      id: `delete-${adminId}`,
    });
    return { success: false, error: errorMessage };
  }
}

export const createAdminColumns = (
  currentAdminId: string | undefined,
  currentAdminRole: ClientRole | undefined,
  refetchAdmins: () => Promise<void>
): ColumnDef<AdminUser>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        {row.getValue("fullName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("email") || "-",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span className="capitalize">{row.getValue("role")}</span>
      </div>
    ),
  },
  {
    // 💡 FIX: Use accessorFn for a custom sorting function for nested objects
    id: "registeredBy", // Use a unique ID instead of accessorKey
    header: "Registered By",
    accessorFn: (row) => row.registeredBy?.fullName, // This tells the table how to access the value for sorting
    cell: ({ row }) => {
      const registeredBy = row.original.registeredBy;
      return registeredBy ? (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <CircleUser className="h-4 w-4" />
          {registeredBy.fullName}
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const admin = row.original;
      const isMainAdmin = currentAdminRole === ClientRole.MAIN_ADMIN;
      const isSelf = currentAdminId === admin.id;

      const isDeleteDisabled = isSelf || (admin.role === ClientRole.MAIN_ADMIN);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {isMainAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/admins/${admin.id}/edit`}>
                    <Button variant="ghost" className="w-full justify-start h-auto p-0">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Admin
                    </Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 focus:text-red-700"
                      disabled={isDeleteDisabled}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Admin
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the administrator account{" "}
                        <span className="font-bold text-red-600">{admin.fullName}</span>.
                        {isSelf && (
                          <p className="mt-2 text-orange-500 font-semibold">
                            You cannot delete your own account.
                          </p>
                        )}
                        {admin.role === ClientRole.MAIN_ADMIN && !isSelf && (
                            <p className="mt-2 text-orange-500 font-semibold">
                                You cannot delete another Main Admin account.
                            </p>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await handleDeleteAdmin(admin.id, currentAdminId, currentAdminRole, refetchAdmins);
                        }}
                        disabled={isDeleteDisabled}
                        className={isDeleteDisabled ? "bg-gray-400 cursor-not-allowed" : ""}
                      >
                        {isDeleteDisabled ? "Not Allowed" : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];