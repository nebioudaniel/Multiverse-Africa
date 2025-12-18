"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserCog,
  User,
  Mail,
  LogOut,
  Activity,
  ListChecks,
  LucideIcon,
   // Re-importing Cube for the visual placeholder logo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
// Define the roles allowed to be considered "admin" for sidebar access control
const ADMIN_ROLES = ['MAIN_ADMIN', 'REGISTRAR_ADMIN'];

// --- Sidebar Navigation Item Structure ---

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  iconColor: string;
  roles: ('MAIN_ADMIN' | 'REGISTRAR_ADMIN')[];
  order: number; // Used for strict sorting
}

// Defining all possible links with strict roles and order
const ALL_FLAT_NAV_ITEMS: NavItem[] = [
  // Dashboard (Always first, common)
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, iconColor: "text-blue-500", roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], order: 0 },

  // MAIN_ADMIN Links
  // 1. Users
  { title: "Users", href: "/admin/users", icon: Users, iconColor: "text-blue-500", roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], order: 1 },
  // 2. Admins
  { title: "Admins", href: "/admin/admins", icon: UserCog, iconColor: "text-blue-500", roles: ['MAIN_ADMIN'], order: 2 },
  // 3. Applications
  { title: "Applications", href: "/admin/applications", icon: ListChecks, iconColor: "text-blue-500", roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], order: 3 },
  // 4. Activity
  { title: "Activity", href: "/admin/activity", icon: Activity, iconColor: "text-blue-500", roles: ['MAIN_ADMIN'], order: 4 },
  // 5. Contact
  { title: "Contact", href: "/admin/contact", icon: Mail, iconColor: "text-blue-500", roles: ['MAIN_ADMIN'], order: 5 },
  // 6. Profile
  { title: "Profile", href: "/admin/profile", icon: User, iconColor: "text-blue-500", roles: ['MAIN_ADMIN', 'REGISTRAR_ADMIN'], order: 6 },
];

// Reusable component for a single Nav Link
interface NavLinkProps {
  href: string;
icon: LucideIcon;
  title: string;
  pathname: string;
  iconColor: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, title, pathname, iconColor }) => {
  const isActive = pathname === href;
  // UI Styling to match the light, compact, flat design
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-4 p-3 rounded-xl transition-all duration-150 text-base font-medium",
        isActive
          ? "bg-white text-black shadow-sm" // Active state is white background, black text
          : "text-gray-600 hover:bg-gray-100/50" // Inactive is light gray text, subtle hover
      )}
    >
      {/* Icon color logic: Black when active, blue when inactive */}
     <Icon className={cn("h-5 w-5", isActive ? "text-black" : iconColor)} />
      <span className="truncate">{title}</span>
    </Link>
  );
};


export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const userRole = (session?.user as any)?.role as string | undefined;

  if (status === 'loading' || !session) {
    return null;
  }

  // Filter and sort the links based on the current user's role
  const finalNavItems = ALL_FLAT_NAV_ITEMS
    .filter(item => item.roles.includes(userRole as any))
    .sort((a, b) => a.order - b.order);

  return (
    // Sidebar Container: Light gray background, fixed width
    <div className="w-64 h-screen flex-shrink-0 flex flex-col border-r bg-gray-50 text-gray-800 shadow-xl transition-all duration-300">
      
      {/* Sidebar Header/Logo Area: Adjusted padding (pt-10) and replaced text with logo placeholder */}
      <div className="pt-10 pb-4 px-6 border-b border-gray-100/50">
        <div className="flex items-center space-x-2">
            
            {/* ACTION: Replace the <Cube /> component below with your actual Image component 
              referencing your logo file from the public folder.
              Example: <Image src="/path/to/your/logo.svg" alt="Multivers Admin Logo" width={32} height={32} />
              
              Using Cube as the visual placeholder requested:
            */}
            <Image
  src="/h.png"
  alt="Admin Panel"
  className="h-10 w-auto"
  width={40} // Provide a base width
  height={40} // Provide a base height
  priority // Good for logos/LCP elements
/>
            {/* Changed "Multivers Admin" to a simpler "Admin Panel" to imply the logo is the main identity */}
        </div>
        <p className="text-xs text-gray-400 mt-1 truncate pl-10">
          {userRole ? userRole.replace('_', ' ') : 'User'}
        </p>
      </div> 
      {/* Navigation Links using ScrollArea */}
      <ScrollArea className="flex-grow py-4 px-4">
        <nav className="space-y-1">
          {finalNavItems.map((item) => (
           <NavLink
    key={item.href}
    {...item}
    icon={item.icon as LucideIcon} // Explicitly cast the icon
    pathname={pathname}
  />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer and Logout */}
      <div className="p-4 pt-0 space-y-4">
        <div className="space-y-2">
            <Button 
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-100/50 hover:text-black rounded-xl p-3 h-auto font-medium space-x-4"
            >
                {/* Logout icon is grayed out to match the UI style */}
                <LogOut className="h-5 w-5 text-gray-400" />
                <span className="truncate">Log Out</span>
            </Button>
        </div>
      </div>
    </div>
  );
}