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
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { AdminNavItem } from "@/components/admin/admin-nav-items";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    iconName: "layout-dashboard" as const,
    label: "Dashboard",
    href: "/admin"
  },
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
    iconName: "hotel" as const,
    label: "Hotels",
    href: "/admin/hotels"
  },
  {
    iconName: "settings" as const,
    label: "Fee Settings",
    href: "/admin/settings"
  },
  {
    iconName: "package" as const,
    label: "Tours",
    href: "/admin/tours"
  },
  {
    iconName: "file-text" as const,
    label: "Trip Requests",
    href: "/admin/tour-requests",
  },
  {
    iconName: "info" as const,
    label: "About Us",
    href: "/admin/about-us"
  },
  {
    iconName: "users" as const,
    label: "User Management",
    href: "/admin/users"
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
    <SidebarProvider>
      <Sidebar
        className="border-r border-gray-800"
      >
        <SidebarHeader className="border-b border-gray-800 bg-black">
          <div className="p-6">
            <Link href="/" className="block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <span className="text-black font-black text-lg">B</span>
                </div>
                <div>
                  <span className="text-lg font-bold tracking-widest uppercase block text-white">
                    BHUTAN
                  </span>
                  <span className="text-[9px] tracking-[0.2em] text-gray-400 block">
                    ADMIN PORTAL
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-black text-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2 py-4">
                {menuItems.map((item) => (
                  <AdminNavItem
                    key={item.href}
                    iconName={item.iconName}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-8 flex items-center justify-between ">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-none" />
            <AdminBreadcrumbs />
          </div>
          <div className="flex items-center gap-4">

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
        <div className="h-full bg-gray-50">
          <div className="p-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
