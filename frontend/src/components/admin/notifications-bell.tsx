"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TourRequest } from "@/app/admin/tour-requests/types";
import { useNotifications } from "./notifications-context";

export function NotificationsBell() {
    const [open, setOpen] = useState(false);
    const { unreadCount, recent, refresh, markOneRead, markAll } = useNotifications();

    const handleItemClick = (req: TourRequest) => {
        setOpen(false);
        if (!req.readAt) markOneRead(req._id!);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) refresh();
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                    className="relative flex h-10 w-10 items-center justify-center border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-none">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                        Trip Requests
                    </span>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAll}
                            className="text-[10px] font-medium uppercase tracking-wider text-amber-600 hover:text-amber-700"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {recent.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-gray-400">
                        No requests yet
                    </div>
                ) : (
                    <ScrollArea className="max-h-96">
                        <ul className="divide-y divide-gray-100">
                            {recent.map((req) => {
                                const isUnread = !req.readAt;
                                const name = `${req.firstName ?? ""} ${req.lastName ?? ""}`.trim() || req.email;
                                return (
                                    <li key={req._id}>
                                        <Link
                                            href={`/admin/tour-requests/${req._id}`}
                                            onClick={() => handleItemClick(req)}
                                            className={cn(
                                                "flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50",
                                                isUnread && "bg-amber-50/60"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                                    isUnread ? "bg-amber-500" : "bg-transparent"
                                                )}
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-gray-900">
                                                    {name}
                                                </span>
                                                <span className="block truncate text-xs text-gray-500">
                                                    {req.tourName || "Custom Trip"}
                                                </span>
                                                {req.createdAt && (
                                                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-gray-400">
                                                        {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                )}

                <div className="border-t border-gray-200">
                    <Link
                        href="/admin/tour-requests"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50"
                    >
                        View all
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
