// ActivityLogPageClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
// FIX 1: Removed unused imports CardHeader, CardTitle
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Search, User, Tag, Clock, PlusCircle, Trash2, CircleDashed, Edit } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ActivityLog {
  id: string;
  createdAt: string;
  action: string;
  description?: string;
  entityId?: string;
  entityType?: string;
  performedBy?: {
    id: string;
    fullName: string | null;
    email: string | null;
    role: string;
  };
  subjectId?: string;
  subjectType?: string;
}

interface AdminUser {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
}

const getActionIcon = (action: string) => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('created')) {
    return <PlusCircle className="w-4 h-4 text-green-500" />;
  }
  if (lowerAction.includes('deleted')) {
    return <Trash2 className="w-4 h-4 text-red-500" />;
  }
  if (lowerAction.includes('updated')) {
    return <Edit className="w-4 h-4 text-blue-500" />;
  }
  return <CircleDashed className="w-4 h-4 text-gray-500" />;
};

export default function ActivityLogPageClient() {
  // Assuming the next-auth.d.ts type extension is correctly implemented now.
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAdminId, setSelectedAdminId] = useState<string>(searchParams.get('adminId') || 'all');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [currentSearchInput, setCurrentSearchInput] = useState<string>(searchParams.get('search') || '');

  // State for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

  // Redirect if not MAIN_ADMIN
useEffect(() => {
  // 🛑 FIX APPLIED: Use type assertion for session.user.role check on page load
  if (status === 'loading') return; // Always check loading first

  if ((session?.user as any)?.role !== 'MAIN_ADMIN') {
    router.push("/admin/dashboard");
  }
}, [session, status, router]);

  // Fetch Admins for filter dropdown
  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/admins-for-activity');
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data: AdminUser[] = await res.json();
      setAdmins([{ id: 'all', fullName: 'All Administrators', email: null, role: 'ALL' }, ...data]);
    } catch (err: unknown) { // FIX 2: Changed 'err: any' to 'err: unknown'
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error('Error fetching admins:', errorMessage);
      setError('Failed to load administrators for filtering.');
    }
  }, []);

  // Fetch Activity Logs
  const fetchActivityLogs = useCallback(async () => {
   // 🛑 FIX APPLIED: Use type assertion for session.user.role check before fetch
   if (status === 'loading' || (session?.user as any)?.role !== 'MAIN_ADMIN') return ;

    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (selectedAdminId && selectedAdminId !== 'all') {
        query.append('adminId', selectedAdminId);
      }
      if (searchTerm) {
        query.append('search', searchTerm);
      }

      const res = await fetch(`/api/admin/activity?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch activity logs');
      const data: ActivityLog[] = await res.json();
      setActivities(data);
    } catch (err: unknown) { // FIX 2: Changed 'err: any' to 'err: unknown'
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error('Error fetching activity logs:', errorMessage);
      setError('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  }, [session, status, selectedAdminId, searchTerm]);

useEffect(() => {
  // 🛑 FIX APPLIED: Use type assertion for session.user.role check on initial load/change
  if ((session?.user as any)?.role === 'MAIN_ADMIN') {
    fetchAdmins();
    fetchActivityLogs();
  }
}, [session, fetchAdmins, fetchActivityLogs]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedAdminId && selectedAdminId !== 'all') {
      params.set('adminId', selectedAdminId);
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    router.replace(`/admin/activity?${params.toString()}`);
  }, [selectedAdminId, searchTerm, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(currentSearchInput);
  };

  const handleActivityClick = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

 // 🛑 FIX APPLIED: Use type assertion for rendering guard
 if ((session?.user as any)?.role !== 'MAIN_ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Administrator" />
            </SelectTrigger>
            <SelectContent>
              {admins.map(admin => (
                <SelectItem key={admin.id} value={admin.id} className="flex items-center">
                  {admin.id !== 'all' && <User className="w-4 h-4 mr-2" />}
                  {admin.fullName || admin.email || admin.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full md:w-[300px]">
            <Input
              placeholder="Search activity..."
              value={currentSearchInput}
              onChange={handleSearchChange}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={handleSearchSubmit} className="w-full md:w-auto">Apply Filter</Button>
        </div>
      </div>
      <Card>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No activities found.</p>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr] md:grid-cols-[1.5fr_1.5fr_1fr_1.5fr] gap-4 py-3 px-4 border-b border-gray-200 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                  <div className="hidden sm:block">Action</div>
                  <div>Description</div>
                  <div className="hidden md:block">User</div>
                  <div className="text-right">Timestamp</div>
                </div>
                {/* Table Body */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivityClick(activity)}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1.5fr_1.5fr_1fr_1.5fr] items-center gap-4 text-sm text-gray-800 dark:text-gray-200">
                        <div className="font-semibold hidden sm:flex items-center gap-2">
                          {getActionIcon(activity.action)}
                          {activity.action}
                        </div>
                        <div>{activity.description || 'No description'}</div>
                        <div className="text-gray-500 dark:text-gray-400 hidden md:block">
                          {activity.performedBy?.fullName || activity.performedBy?.email || 'N/A'}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-right">
                          {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* The Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedActivity && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-1xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-500" />
                {selectedActivity.action}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Logged at: {format(new Date(selectedActivity.createdAt), 'MMMM dd, yyyy HH:mm:ss')}
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-4" />

            <div className="space-y-1">
              {selectedActivity.description && (
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    Description
                  </p>
                  <p className="text-gray-700 mt-1">{selectedActivity.description}</p>
                </div>
              )}
              {selectedActivity.performedBy && (
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" /> Performed By
                  </p>
                  <p className="text-gray-700 mt-1">
                    {selectedActivity.performedBy.fullName || selectedActivity.performedBy.email} ({selectedActivity.performedBy.role})
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">ID: {selectedActivity.performedBy.id}</p>
                </div>
              )}
              {selectedActivity.entityId && selectedActivity.entityType && (
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Target Entity
                  </p>
                  <p className="text-gray-700 mt-1">{selectedActivity.entityType}</p>
                  <p className="text-gray-500 text-xs mt-0.5">ID: {selectedActivity.entityId}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}