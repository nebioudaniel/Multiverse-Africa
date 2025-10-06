// components/admin/users/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  EyeIcon, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Car, 
  Signature, 
  ShieldCheck, 
  MapPin, 
  Hash,
  Fingerprint,
  Users as UsersIcon,
  Ruler
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Define roles to match the server-side enum
enum ClientRole {
  MAIN_ADMIN = "MAIN_ADMIN",
  REGISTRAR_ADMIN = "REGISTRAR_ADMIN",
  FINANCE_ADMIN = "FINANCE_ADMIN",
  APPLICANT = "APPLICANT",
}

export type UserApplicant = {
  id: string;
  fullName: string;
  emailAddress?: string | null;
  primaryPhoneNumber?: string | null;
  role: ClientRole;
  createdAt: string; 
  fatherName?: string | null;
  grandfatherName?: string | null;
  associationName?: string | null;
  membershipNumber?: string | null;
  isBusiness: boolean;
  tin?: string | null;
  businessLicenseNo?: string | null;
  region?: string | null;
  city?: string | null;
  woredaKebele?: string | null;
  alternativePhoneNumber?: string | null;
  preferredVehicleType?: string | null;
  vehicleQuantity?: number | null;
  intendedUse?: string | null;
  digitalSignatureUrl?: string | null;
  agreedToTerms: boolean;
};

type TableMeta = {
  isLoading: boolean;
  refetch?: () => void;
};

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null | boolean | undefined }) => {
  const displayValue = (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value) || "N/A";
  
  return (
    // Adjusted grid for better alignment and visibility
    <div className="grid grid-cols-[140px_1fr] items-start gap-x-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon className="h-4 w-4 text-green-600" />
        <span className="font-medium">{label}:</span>
      </div>
      <div className="text-sm text-gray-900 font-medium break-words">{displayValue}</div>
    </div>
  );
};


export const createUserColumns = (currentUserId?: string, currentUserRole?: ClientRole): ColumnDef<UserApplicant>[] => {
  const router = useRouter();

  const handleDelete = async (
    userId: string,
    userRole: ClientRole,
    currentAdminId: string,
    currentAdminRole: ClientRole,
    refetch?: () => void
  ) => {
    // FIX: Only MAIN_ADMIN is allowed to delete.
    const canDelete = currentAdminRole === ClientRole.MAIN_ADMIN;

    if (!canDelete) {
      toast.error("Permission Denied", { description: "Only the Main Administrator can delete users." });
      return;
    }

    // Prevent self-deletion
    if (userId === currentAdminId) {
      toast.error("Action Forbidden", { description: "You cannot delete your own account." });
      return;
    }

    toast.info("Deleting user...", { id: `delete-${userId}`, duration: 5000 });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }

      toast.success("User Deleted", {
        description: `User with ID ${userId} has been successfully deleted.`,
        id: `delete-${userId}`
      });
      // Use the refetch function from the table's meta
      if (refetch) {
        refetch();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Deletion Failed", {
        description: error.message,
        id: `delete-${userId}`,
      });
    }
  };

  return [
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
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-4 w-[150px]" />;
        }
        return <div className="capitalize">{row.getValue("fullName")}</div>;
      },
    },
    {
      accessorKey: "emailAddress",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-4 w-[200px]" />;
        }
        return row.getValue("emailAddress");
      },
    },
    {
      accessorKey: "primaryPhoneNumber",
      header: "Phone Number",
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-4 w-[120px]" />;
        }
        return row.getValue("primaryPhoneNumber");
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-4 w-[80px]" />;
        }
        return <Badge variant="secondary" className="capitalize">{row.getValue("role")}</Badge>;
      },
    },
    {
      accessorKey: "createdAt", 
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Registered Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-4 w-[120px]" />;
        }
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      id: "actions",
      enableHiding: false, 
      cell: ({ row, table }) => {
        const meta = table.options.meta as TableMeta;
        if (meta?.isLoading) {
          return <Skeleton className="h-8 w-8 rounded-full" />;
        }

        const user = row.original;
        
        // FIX: Only MAIN_ADMIN is allowed to delete.
        const canDelete = currentUserRole === ClientRole.MAIN_ADMIN;
        const isSelf = user.id === currentUserId;
        const isDeleteDisabled = !canDelete || isSelf;

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
              <DropdownMenuSeparator />

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <EyeIcon className="mr-2 h-4 w-4 text-gray-600" /> View Details
                  </DropdownMenuItem>
                </DialogTrigger>
                {/* Width: Set to w-[90vw] for a little more width than max-w-7xl */}
                <DialogContent className="w-[90vw] !max-w-none"> 
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                      <UsersIcon className="h-7 w-7 text-green-600" /> {user.fullName}'s Profile
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Detailed information for {user.fullName} ({user.role.replace('_', ' ')}).
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[75vh] w-full pr-4"> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                      
                      <div className="space-y-4">
                        <h4 className="text-lg text-green-700 font-bold mb-2 border-b border-green-200 pb-1">Personal Information</h4>
                        <div className="space-y-3 pt-2">
                          <DetailRow icon={User} label="Full Name" value={user.fullName} />
                          <DetailRow icon={User} label="Father's Name" value={user.fatherName} />
                          <DetailRow icon={User} label="Grandfather's Name" value={user.grandfatherName} />
                          <DetailRow icon={Mail} label="Email Address" value={user.emailAddress} />
                          <DetailRow icon={Phone} label="Primary Phone" value={user.primaryPhoneNumber} />
                          <DetailRow icon={Phone} label="Alternative Phone" value={user.alternativePhoneNumber} />
                          <DetailRow icon={UsersIcon} label="User Role" value={user.role.replace('_', ' ')} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg text-green-700 font-bold mb-2 border-b border-green-200 pb-1">Business & Membership</h4>
                        <div className="space-y-3 pt-2">
                          <DetailRow icon={Building} label="Is Business" value={user.isBusiness} />
                          <DetailRow icon={Building} label="Association Name" value={user.associationName} />
                          <DetailRow icon={Hash} label="Membership Number" value={user.membershipNumber} />
                          <DetailRow icon={Fingerprint} label="TIN" value={user.tin} />
                          <DetailRow icon={Ruler} label="Business License No." value={user.businessLicenseNo} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg text-green-700 font-bold mb-2 border-b border-green-200 pb-1">Address & Vehicle</h4>
                        <div className="space-y-3 pt-2">
                          <DetailRow icon={MapPin} label="Region" value={user.region} />
                          <DetailRow icon={MapPin} label="City" value={user.city} />
                          <DetailRow icon={MapPin} label="Woreda/Kebele" value={user.woredaKebele} />
                          <DetailRow icon={Car} label="Preferred Vehicle" value={user.preferredVehicleType} />
                          <DetailRow icon={Hash} label="Vehicle Quantity" value={user.vehicleQuantity} />
                          <DetailRow icon={Car} label="Intended Use" value={user.intendedUse} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg text-green-700 font-bold mb-2 border-b border-green-200 pb-1">Other Information</h4>
                        <div className="space-y-3 pt-2">
                          <DetailRow icon={ShieldCheck} label="Agreed to Terms" value={user.agreedToTerms} />
                          <DetailRow icon={Signature} label="Digital Signature" value={user.digitalSignatureUrl} />
                          <DetailRow icon={User} label="Registered Date" value={new Date(user.createdAt).toLocaleDateString()} />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-700"
                    disabled={isDeleteDisabled}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete 
                      <span className="font-bold text-red-600"> {user.fullName} </span>
                      and remove their data from our servers.
                      {isSelf && (
                        <p className="mt-2 text-orange-500 font-semibold">
                          You cannot delete your own account.
                        </p>
                      )}
                      {!canDelete && !isSelf && (
                        <p className="mt-2 text-orange-500 font-semibold">
                          You do not have permission to delete this user. Only the Main Administrator can.
                        </p>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const meta = table.options.meta as TableMeta;
                        if (currentUserId && currentUserRole) {
                          await handleDelete(user.id, user.role, currentUserId, currentUserRole, meta?.refetch);
                        }
                      }}
                      disabled={isDeleteDisabled}
                      className={isDeleteDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
                    >
                      {isDeleteDisabled ? "Not Allowed" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};