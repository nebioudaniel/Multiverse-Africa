"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomLoader from "@/components/ui/custom-loader";
import { DataTable } from "@/components/ui/data-table";
// FIX: Changed import path from "@/components/admin/users/columns" to "./columns"
import { createUserColumns, UserApplicant, ClientRole } from "./columns"; 

// Lucide-React Icons
import {
  ArrowLeftCircle,
  Users,
  Search,
  ListChecks
} from "lucide-react";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Next.js Link for navigation
import Link from "next/link";

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
    }
    return "An unexpected error occurred.";
}

export default function UserListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Safely extract current user ID and Role for column actions (like delete permission)
  const currentUserId = (session?.user as any)?.id as string | undefined;
  const currentUserRole = ((session?.user as any)?.role as ClientRole) ?? undefined;
  
  // Existing role check (for navigation guard)
  const userRole = currentUserRole ? String(currentUserRole) : "";
  
  const fetchUsers = useCallback(async (query: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (query) {
        url.searchParams.set('search', query);
      }
      
      const res = await fetch(url.toString());
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch applicants.");
      }
      
      const { data } = await res.json();
      setUsers(data);
    } catch (err: unknown) { // FIX: Changed 'any' to 'unknown'
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error("Error loading applicants", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || !["MAIN_ADMIN", "REGISTRAR_ADMIN"].includes(userRole)) {
         toast.error("Access Denied", {
           description: "You do not have permission to view this page.",
         });
         router.push("/admin/dashboard");
         return;
       }
    // Debounce the fetch request
    const handler = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [session, status, router, fetchUsers, searchQuery, userRole]); // Added userRole to dependencies

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 1. Create the refetch function to pass to the table's meta
  const refetchUsers = useCallback(() => fetchUsers(searchQuery), [fetchUsers, searchQuery]);

  // 2. Generate columns with current user context
  const columns = createUserColumns(currentUserId, currentUserRole);

  // 3. Define the meta object for the table
  const tableMeta = {
    isLoading, // Passed to columns for skeleton loading states
    refetch: refetchUsers, // Passed to column actions (like handleDelete)
  };


  // The custom loader is only for the initial page load, not for search.
  if (status === "loading") {
    return <CustomLoader message="Loading applicants..." emoji="👥" />;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Error Loading Applicants</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          <Users className="inline-block mr-3 text-green-600" />
          Manage Applicants
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Applicant List</CardTitle>
          <CardDescription>
            A list of all registered applicants (users) in the system. Search by name, email, or phone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search by name, email, phone, ID..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                />
            </div>
          </div>
          {/* FIX: Pass the columns, fetched users data, and the meta object */}
          <DataTable 
            columns={columns} 
            data={users} 
            meta={tableMeta} 
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Link href="/admin/applications">
          <Button variant="outline">
            <ListChecks className="mr-2 h-4 w-4" /> View All Applications
          </Button>
        </Link>
      </div>
    </div>
  );
}