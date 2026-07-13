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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminNavItem } from "@/components/admin/admin-nav-items";
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

        <SidebarContent className="bg-black text-white">
          {menuGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-2 pb-2">
                  {group.items.map((item) => (
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
          ))}
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
