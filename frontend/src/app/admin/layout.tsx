import * as React from "react";

export const dynamic = "force-dynamic";
import "./admin.css";
import { AdminBreadcrumbs } from "@/components/admin/admin-bread-crumbs";
import { redirect } from "next/navigation";
import { getAdminUser, supabaseServer } from "@/lib/supabase/server";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminNavItem } from "@/components/admin/admin-nav-items";
import { NotificationsBell } from "@/components/admin/notifications-bell";
import { NotificationsProvider } from "@/components/admin/notifications-context";
import { Button } from "@/components/ui/button";

const menuGroups = [
  {
    label: "Overview",
    items: [
      {
        iconName: "layout-dashboard" as const,
        label: "Dashboard",
        href: "/admin",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        iconName: "map-pin" as const,
        label: "Destinations",
        href: "/admin/destinations",
      },
      {
        iconName: "layers" as const,
        label: "Experience Types",
        href: "/admin/experience-types",
      },
      {
        iconName: "compass" as const,
        label: "Experiences",
        href: "/admin/experiences",
      },
      {
        iconName: "package" as const,
        label: "Tours",
        href: "/admin/tours",
      },
      {
        iconName: "hotel" as const,
        label: "Hotels",
        href: "/admin/hotels",
      },
    ],
  },
  {
    label: "Enquiries",
    items: [
      {
        iconName: "file-text" as const,
        label: "Trip Requests",
        href: "/admin/tour-requests",
      },
    ],
  },
  {
    label: "Site Settings",
    items: [
      {
        iconName: "info" as const,
        label: "About Us",
        href: "/admin/about-us",
      },
      {
        iconName: "phone" as const,
        label: "Contact & Socials",
        href: "/admin/contact",
      },
      {
        iconName: "help-circle" as const,
        label: "FAQ",
        href: "/admin/faq",
      },
      {
        iconName: "settings" as const,
        label: "Fee Settings",
        href: "/admin/settings",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        iconName: "users" as const,
        label: "User Management",
        href: "/admin/users",
      },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <NotificationsProvider>
    <SidebarProvider>
      <Sidebar
        className="border-r border-gray-800"
      >
        <SidebarHeader className="border-b border-gray-800 bg-black">
          <div className="p-6">
            <Link href="/" className="block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="Bhutan Upward Travels logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-widest uppercase block text-white">
                    BHUTAN UPWARD
                  </span>
                  <span className="text-[9px] tracking-[0.2em] text-gray-400 block">
                    ADMIN PORTAL
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-black text-white gap-0">
          {menuGroups.map((group, i) => (
            <SidebarGroup key={group.label} className={i > 0 ? "pt-1" : "pt-2"}>
              <SidebarGroupLabel className="px-4 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-2 gap-0.5">
                  {group.items.map((item) => (
                    <AdminNavItem
                      key={item.href}
                      iconName={item.iconName}
                      label={item.label}
                      href={item.href}
                      unreadBadge={item.href === "/admin/tour-requests"}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          {/* Bottom padding so last item isn't flush against the footer */}
          <div className="h-4 shrink-0" />
        </SidebarContent>

        <SidebarFooter className="bg-black border-t border-gray-800/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] text-gray-500 tracking-widest uppercase truncate">
              Admin Portal
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="h-svh overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-none" />
            <AdminBreadcrumbs />
          </div>
          <div className="flex items-center gap-4">
            <NotificationsBell />
            <form
              action={async () => {
                "use server";
                const supabase = await supabaseServer();
                await supabase.auth.signOut();
                redirect("/login");
              }}
            >
              <Button
                variant="destructive"
                type="submit"
                className="w-full flex items-center justify-center gap-3 rounded-none bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </header>
        <div className="bg-gray-50 min-h-[calc(100svh-4rem)]">
          <div className="p-8 overflow-x-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </NotificationsProvider>
  );
}
