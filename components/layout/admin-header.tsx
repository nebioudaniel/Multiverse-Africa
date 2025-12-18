// app/components/AdminHeader.tsx
"use client";

import { useSession, signOut, getSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Menu, Bell, UserPlus, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { useEffect, useState, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Define the roles allowed to see the dashboard/notifications
const ALLOWED_ADMIN_ROLES = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];

// Define the interface for the raw data coming from the API
interface RawActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: string; // ISO string
}

// Define notification item interface (the processed data)
interface NotificationItem {
  id: string;
  action: string;      // Corresponds to ActivityLog.action
  description: string; // Corresponds to ActivityLog.description
  createdAt: string;   // ISO string from ActivityLog.createdAt
  read: boolean;       // Computed read status
}

export default function AdminHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fullName, setFullName] = useState(session?.user?.name);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    // TEMPORARY FIX: Assert 'session.user' as 'any' to bypass the TypeScript error.
    const user = session?.user as any; 

    // Line 63 fix: Check loading status OR if the role property is missing
    if (status === 'loading' || !user?.role) return;

    // Use the defined roles array for a clean authorization check
    const isAuthorized = ALLOWED_ADMIN_ROLES.includes(user.role);

    if (!isAuthorized) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoadingNotifications(true);
    try {
      // Fetch notifications (ActivityLog entries) and the user's last viewed timestamp
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const responseBody = await res.json();
      const activities: RawActivityLog[] = responseBody.data || []; 

      const currentUsersLastViewedTimestamp = responseBody.currentUsersLastViewedTimestamp
        ? new Date(responseBody.currentUsersLastViewedTimestamp)
        : null;

      const notificationsWithReadStatus: NotificationItem[] = activities.map((activity: RawActivityLog) => {
        const isRead = currentUsersLastViewedTimestamp
          ? new Date(activity.createdAt) <= currentUsersLastViewedTimestamp
          : false;

        return {
          id: activity.id,
          action: activity.action,
          description: activity.description,
          createdAt: activity.createdAt,
          read: isRead,
        };
      });

      setNotifications(notificationsWithReadStatus);
      setUnreadCount(notificationsWithReadStatus.filter(notif => !notif.read).length);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Optionally show a toast error
    } finally {
      setLoadingNotifications(false);
    }
  }, [session, status]);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications(); 
      const interval = setInterval(fetchNotifications, 30000); 
      return () => clearInterval(interval); 
    }
  }, [fetchNotifications, status]);

  // Mark ALL notifications as read by updating the user's lastViewedActivityTimestamp on the backend
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "mark_all_read" }), 
      });

      if (!res.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      await fetchNotifications();
      setIsPopoverOpen(false); 
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [fetchNotifications, setIsPopoverOpen]);

  // Refresh full name periodically (e.g. after editing profile)
  useEffect(() => {
    const syncSession = async () => {
      const updated = await getSession();
      if (updated?.user?.name && updated.user.name !== fullName) {
        setFullName(updated.user.name);
      }
    };

    syncSession(); 

    if (status === 'authenticated') {
      const interval = setInterval(syncSession, 7000); 
      return () => clearInterval(interval); 
    }
  }, [fullName, status]);

  if (status === "loading" || !session?.user) {
    return null;
  }

  // Calculate user initials
  const userInitials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : (session.user.email || "U").substring(0, 2).toUpperCase();

  // Determine if user has the required admin role
  // Apply type assertion here too
  const userWithRole = session.user as any;
  const isMainOrRegistrarAdmin = userWithRole.role 
    ? ALLOWED_ADMIN_ROLES.includes(userWithRole.role) 
    : false;


  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-white shadow-sm">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="mt-4 space-y-2">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="w-full justify-start">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/admin/applications")} className="w-full justify-start">
                Applications
              </Button>
              <Button variant="ghost" onClick={() => router.push(`/admin/profile/`)} className="w-full justify-start">
                Profile
              </Button>
              {/* Add other navigation links here for mobile sheet */}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Notification Icon (Only for specified Admin roles) */}
      <div className="flex-grow flex justify-end items-center space-x-4">
        {isMainOrRegistrarAdmin && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6 text-gray-700" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold text-lg">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                {loadingNotifications ? (
                  <div className="p-4 text-center text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No new notifications.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by newest first
                      .map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            'flex items-start gap-3 p-4 hover:bg-gray-50',
                            notif.read ? 'text-gray-500 bg-gray-50' : 'text-gray-900 bg-white'
                          )}
                        >
                          {/* Conditional icon based on activity action */}
                          {notif.action === 'USER_REGISTERED' ? (
                            <UserPlus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          ) : notif.action === 'APPLICATION_CREATED' ? (
                            <FileText className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            // Default icon for other activity types
                            <Bell className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <div className="flex-grow">
                            <p className={cn('text-sm font-medium', notif.read ? 'line-through' : '')}>
                              {notif.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || undefined} alt={fullName || "User"} />
                <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{fullName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email || userWithRole.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/admin/profile`)}>
              <User className="mr-2 h-4 w-4 text-gray-600" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}