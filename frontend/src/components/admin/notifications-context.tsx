"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { TourRequest } from "@/app/admin/tour-requests/types";
import {
    getTourRequestNotifications,
    markAllTourRequestsRead,
    markTourRequestRead,
} from "@/app/admin/tour-requests/actions";

const POLL_INTERVAL_MS = 45_000;

interface NotificationsContextValue {
    unreadCount: number;
    recent: TourRequest[];
    refresh: () => Promise<void>;
    markOneRead: (id: string) => void;
    markAll: () => Promise<void>;
}

// Default (no-op) value so consumers never crash outside a provider.
const NotificationsContext = createContext<NotificationsContextValue>({
    unreadCount: 0,
    recent: [],
    refresh: async () => {},
    markOneRead: () => {},
    markAll: async () => {},
});

export function useNotifications() {
    return useContext(NotificationsContext);
}

// Single source of truth for tour-request notifications: polls once and feeds
// both the header bell and the sidebar badge, keeping them in sync.
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [recent, setRecent] = useState<TourRequest[]>([]);

    const refresh = async () => {
        const { unreadCount, recent } = await getTourRequestNotifications(10);
        setUnreadCount(unreadCount);
        setRecent(recent);
    };

    // Initial load + polling for near-live updates.
    useEffect(() => {
        let active = true;
        const run = async () => {
            const { unreadCount, recent } = await getTourRequestNotifications(10);
            if (!active) return;
            setUnreadCount(unreadCount);
            setRecent(recent);
        };
        run();
        const interval = setInterval(run, POLL_INTERVAL_MS);
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    // Optimistically mark one request read (server call is fire-and-forget;
    // the detail page also persists it). No-op if already read.
    const markOneRead = (id: string) => {
        const target = recent.find((r) => r._id === id);
        if (target && target.readAt) return;
        setUnreadCount((c) => Math.max(0, c - 1));
        setRecent((list) =>
            list.map((r) => (r._id === id ? { ...r, readAt: new Date().toISOString() } : r))
        );
        markTourRequestRead(id);
    };

    const markAll = async () => {
        setUnreadCount(0);
        setRecent((list) => list.map((r) => ({ ...r, readAt: r.readAt ?? new Date().toISOString() })));
        await markAllTourRequestsRead();
        refresh();
    };

    return (
        <NotificationsContext.Provider value={{ unreadCount, recent, refresh, markOneRead, markAll }}>
            {children}
        </NotificationsContext.Provider>
    );
}
