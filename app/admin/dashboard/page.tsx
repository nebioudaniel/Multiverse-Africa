"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Users, Clipboard, DollarSign, ListOrdered, UserPlus, Building, FileText,
  CircleDot, Hourglass, CheckCircle, XCircle, Wallet,
  BarChart,
  GraduationCap,
  Briefcase,
  List,
  X 
} from "lucide-react";
import CustomLoader from "@/components/ui/custom-loader";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'; 
import { 
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

// --- Interface Definitions (Preserved) ---
interface RegistrationItem {
  category: string;
  count: number;
}

interface DashboardSummary {
  totalApplications: number;
  totalUsers: number;
  totalAdmins: number;
  applicationsByStatus: { applicationStatus: string; _count: { id: number } }[];
  loanApplicationsByStatus: { loanApplicationStatus: string; _count: { id: number } }[];
  recentApplications: {
    id: string;
    applicantFullName: string;
    applicationStatus: string;
    loanApplicationStatus: string;
    createdAt: string;
    applicant: { fullName: string; primaryPhoneNumber: string };
    processedBy?: { fullName: string } | null;
  }[];
  registeredUsersCountByAdmin?: number;
  userRegistrationsPerMonth?: { month: string; count: number }[];
  applicationsProcessedPerMonth?: { month: string; count: number }[];
  registrationDistribution?: RegistrationItem[];
}

const MAX_VISIBLE_ASSOCIATIONS = 4;
const ALLOWED_ROLES = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];

// Helper function to safely extract an error message (Preserved)
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
    }
    return "An unexpected error occurred. Please try again.";
}

// --- Helper Components (Preserved) ---
const AssociationItem: React.FC<{ item: RegistrationItem }> = ({ item }) => {
  // Use React.JSX.Element for type safety
  const icons: Record<string, React.JSX.Element> = {
    "Business": <Briefcase className="h-5 w-5 text-blue-500" />,
    "Students": <GraduationCap className="h-5 w-5 text-green-500" />,
    "General": <Users className="h-5 w-5 text-purple-500" />,
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2">
        {icons[item.category] ?? <Building className="h-5 w-5 text-gray-400" />}
        <span className="text-sm font-medium text-gray-700">{item.category}</span>
      </div>
      <span className="text-base font-semibold text-blue-600">{item.count}</span>
    </div>
  );
};

const RegistrationDistributionCard: React.FC<{ distribution: RegistrationItem[] }> = ({ distribution }) => {
  const visibleDistribution = distribution.slice(0, MAX_VISIBLE_ASSOCIATIONS);
  const hasMore = distribution.length > MAX_VISIBLE_ASSOCIATIONS;

  return (
    <Card className="shadow-md rounded-2xl border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Building className="h-5 w-5 text-blue-600" />
          Registrations by Association
        </CardTitle>
        <CardDescription className="text-gray-500">
          Top {MAX_VISIBLE_ASSOCIATIONS} user groups (Total: {distribution.length})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleDistribution.map((item, index) => (
            <AssociationItem key={index} item={item} />
          ))}
        </div>

        {hasMore && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                <List className="h-4 w-4 mr-2" />
                Show All {distribution.length} Associations
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Full Association Distribution</DialogTitle>
                <DialogDescription>
                  A complete list of all registered users grouped by their association/category.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto pt-4">
                <div className="grid gap-4">
                  {distribution.map((item, index) => (
                    <AssociationItem key={`dialog-${index}`} item={item} />
                  ))}
                </div>
              </div>
              
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

// --- Helper Functions (Preserved) ---
const getApplicationStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "NEW": return "outline";
    case "UNDER_REVIEW": return "secondary";
    case "APPROVED": return "default";
    case "REJECTED": return "destructive";
    default: return "default";
  }
};

const getApplicationStatusIcon = (status: string) => {
  switch (status) {
    case "NEW": return <CircleDot className="inline-block h-3 w-3 mr-1 text-blue-500" />;
    case "UNDER_REVIEW": return <Hourglass className="inline-block h-3 w-3 mr-1 text-orange-500" />;
    case "APPROVED": return <CheckCircle className="inline-block h-3 w-3 mr-1 text-green-500" />;
    case "REJECTED": return <XCircle className="inline-block h-3 w-3 mr-1 text-red-500" />;
    default: return null;
  }
};

const getLoanStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Pending": return "secondary";
    case "Approved": return "default";
    case "Disbursed": return "outline";
    default: return "default";
  }
};

const getLoanStatusIcon = (status: string) => {
  switch (status) {
    case "Pending": return <Hourglass className="inline-block h-3 w-3 mr-1 text-orange-500" />;
    case "Approved": return <CheckCircle className="inline-block h-3 w-3 mr-1 text-green-500" />;
    case "Disbursed": return <Wallet className="inline-block h-3 w-3 mr-1 text-purple-500" />;
    default: return null;
  }
};

// --- Main Component ---
export default function AdminDashboardPage() {
 const { data: session, status } = useSession();
const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Safely extract user role
const userRole = (session?.user as any)?.role as string | undefined;
const isAuthorized = userRole && ALLOWED_ROLES.includes(userRole);

  // === 1. SESSION & AUTHENTICATION CHECKS (FIXED ORDER) ===
useEffect(() => {
  // Let the server layout handle redirects
  if (status !== "authenticated") return;

  // Client-side role safety check (optional but safe)
  if (!isAuthorized) {
    router.replace("/unauthorized");
  }
}, [status, isAuthorized, router]);

if (status === "loading") {
  return <CustomLoader message="Verifying admin credentials..." emoji="lock" />;
}

if (!session) return null;
if (!isAuthorized) return null;


  // === 2. DATA FETCHING ===
  useEffect(() => {
    // Only run fetch logic if authorized and data hasn't been loaded yet
    // 'isAuthorized' is guaranteed to be true here because of the checks above, 
    // but keeping it as a dependency for clarity and robust hook execution.
    if (!isAuthorized || dashboardData) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/summary");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to load data");
        }
        const data: DashboardSummary = await res.json();
        if (isMounted) {
          setDashboardData(data);
          setError(null);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        if (isMounted) {
          setError(errorMessage);
          toast.error("Error loading dashboard", {
            description: errorMessage,
            duration: 5000,
            richColors: true,
          });
        }
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [isAuthorized, dashboardData]); // Dependencies remain correct


  // === 3. ERROR STATE ===
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // === 4. LOADING DATA ===
  if (!dashboardData) {
    return <CustomLoader message="Loading dashboard data..." emoji="chart" />;
  }

  // === 5. SUCCESS: RENDER DASHBOARD ===
  const dashboard = dashboardData;
  const isAdmin = userRole === "MAIN_ADMIN";
  const isRegistrar = userRole === "REGISTRAR_ADMIN";

  // The rest of the rendering logic is preserved...
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-300">
        <TrendingUp className="inline-block mr-3 text-green-600" />
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md transition-transform duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isRegistrar ? "Applications You Processed/Assigned" : "Total Applications"}
            </CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboard.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRegistrar ? "Applications relevant to you" : "Across all statuses"}
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="shadow-md transition-transform duration-200 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboard.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">All applicants in the system</p>
            </CardContent>
          </Card>
        )}

        {isRegistrar && dashboard.registeredUsersCountByAdmin !== undefined && (
          <Card className="shadow-md transition-transform duration-200 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applicants You Registered</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboard.registeredUsersCountByAdmin}</div>
              <p className="text-xs text-muted-foreground mt-1">Users registered by your account</p>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="shadow-md transition-transform duration-200 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Accounts</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboard.totalAdmins}</div>
              <p className="text-xs text-muted-foreground mt-1">Internal staff accounts</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Visualizations */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b border-gray-300">
        <BarChart className="inline-block mr-2 h-5 w-5 text-gray-500" />
        Key Visualizations
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {isRegistrar && dashboard.applicationsProcessedPerMonth?.length && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>
                <FileText className="inline-block mr-2 h-5 w-5 text-orange-600" />
                Applications You Processed/Assigned (Last 12 Months)
              </CardTitle>
              <CardDescription>Monthly trend of applications you have processed or been assigned.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={dashboard.applicationsProcessedPerMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#cccccc' }} tick={{ fill: '#666666', fontSize: 12 }} angle={-45} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#cccccc' }} tick={{ fill: '#666666', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} labelStyle={{ fontWeight: 'bold', color: '#333' }} itemStyle={{ color: '#555' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="count" fill="#4f46e5" name="Applications Processed/Assigned" barSize={20} radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {isAdmin && dashboard.registrationDistribution?.length && (
          <RegistrationDistributionCard distribution={dashboard.registrationDistribution} />
        )}
      </div>

      {/* Status Distribution */}
      {isAdmin && (
        <>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b border-gray-300">
            <Clipboard className="inline-block mr-2 h-5 w-5 text-gray-500" />
            Status Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Applications by Status</CardTitle>
                <CardDescription>Current distribution of application statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.applicationsByStatus.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.applicationsByStatus.map((item) => (
                        <TableRow key={item.applicationStatus}>
                          <TableCell>
                            <div className="flex items-center">
                              {getApplicationStatusIcon(item.applicationStatus)}
                              <Badge variant={getApplicationStatusVariant(item.applicationStatus)}>
                                {item.applicationStatus.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item._count.id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No application status data available.</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Loan Applications by Status</CardTitle>
                <CardDescription>Current distribution of loan application statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.loanApplicationsByStatus.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.loanApplicationsByStatus.map((item) => (
                        <TableRow key={item.loanApplicationStatus}>
                          <TableCell>
                            <div className="flex items-center">
                              {getLoanStatusIcon(item.loanApplicationStatus)}
                              <Badge variant={getLoanStatusVariant(item.loanApplicationStatus)}>
                                {item.loanApplicationStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item._count.id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No loan application status data available.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Recent Applications */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6 pb-2 border-b border-gray-300">
        <ListOrdered className="inline-block mr-2 h-5 w-5 text-purple-600" />
        Recent Applications
      </h2>
      <Card className="shadow-md mb-8">
        <CardHeader>
          <CardDescription>Latest applications submitted or updated.</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard.recentApplications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No recent applications to display.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Applicant</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>App Status</TableHead>
                  <TableHead>Loan Status</TableHead>
                  <TableHead>Processed By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium text-gray-900">{app.applicant.fullName}</TableCell>
                    <TableCell>{app.applicant.primaryPhoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant={getApplicationStatusVariant(app.applicationStatus)}>
                        {app.applicationStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLoanStatusVariant(app.loanApplicationStatus)}>
                        {app.loanApplicationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.processedBy?.fullName || "N/A"}</TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/applications/${app.id}/edit`)}
                      >
                        View/Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}