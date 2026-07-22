"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useNotifications } from "@/components/admin/notifications-context";
import {
  LayoutDashboard,
  MapPin,
  Compass,
  Package,
  Hotel,
  Info,
  FileText,
  Layers,
  Users,
  Settings,
  Phone,
  HelpCircle,
} from "lucide-react";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "map-pin": MapPin,
  compass: Compass,
  package: Package,
  hotel: Hotel,
  info: Info,
  "file-text": FileText,
  layers: Layers,
  users: Users,
  settings: Settings,
  phone: Phone,
  "help-circle": HelpCircle,
};

interface AdminNavItemProps {
  iconName: keyof typeof iconMap;
  label: string;
  href: string;
  // When true, shows the unread tour-request count as a badge.
  unreadBadge?: boolean;
}

export function AdminNavItem({ iconName, label, href, unreadBadge }: AdminNavItemProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));
  const Icon = iconMap[iconName];
  const showBadge = unreadBadge && unreadCount > 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 transition-all rounded-none!",
            isActive
              ? "bg-amber-600! text-white! font-medium border-l-4 border-black hover:bg-amber-700! hover:text-white!"
              : "transition-all hover:bg-amber-700! hover:text-white!"
          )}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {showBadge && (
            <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
