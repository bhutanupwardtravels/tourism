"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
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
};

interface AdminNavItemProps {
  iconName: keyof typeof iconMap;
  label: string;
  href: string;
}

export function AdminNavItem({ iconName, label, href }: AdminNavItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));
  const Icon = iconMap[iconName];

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
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
