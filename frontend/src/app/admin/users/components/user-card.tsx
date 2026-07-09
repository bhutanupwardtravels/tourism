"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../schema";
import { Mail, Clock, Shield, User as UserIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DeleteUserDialog } from "./delete-user-dialog";

interface UserCardProps {
    user: User;
    isMobile?: boolean; // Added to match interface consistency
}

const roleConfig = {
    admin: {
        label: "Administrator",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <Badge variant="outline" className="bg-amber-100/80 text-amber-800 border-amber-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Administrator</Badge>
    },
    user: {
        label: "Standard User",
        color: "bg-zinc-100 text-zinc-700 border-zinc-200",
        icon: <Badge variant="outline" className="bg-zinc-100/80 text-zinc-800 border-zinc-200 uppercase text-[10px] font-bold tracking-widest rounded-none">Standard User</Badge>
    }
};

export function UserCard({ user, isMobile }: UserCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const roleData = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.user;
    const userId = user.id || user._id || "";

    return (
        <>
            <DeleteUserDialog
                user={user}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
            <motion.div
                className="relative overflow-hidden bg-white border border-gray-100 group cursor-pointer hover:shadow-xl transition-all duration-500 rounded-none h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => router.push(`/admin/users/${userId}/edit`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-8 space-y-6 flex-1">
                    {/* Header: Name and Status */}
                    <div className="flex flex-col gap-2">
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-semibold text-black tracking-tight leading-tight truncate">
                                {user.username}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[180px]">{user.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            {roleData.icon}
                        </div>
                    </div>

                    {/* Additional Details Grid */}
                    <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1.5">
                            Role Description
                        </div>
                        <p className="text-sm font-medium text-black tracking-tight leading-snug">
                            {user.role === "admin"
                                ? "Full system access & management"
                                : "Limited content management access"}
                        </p>
                    </div>

                    {/* Footer Date */}
                    <div className="text-[10px] text-zinc-500 pt-5 flex justify-between items-center -mx-8 -mb-8 px-8 py-5 border-t border-gray-100 mt-auto">
                        <span className="uppercase tracking-widest font-bold text-zinc-500">Joined</span>
                        <span className="font-bold text-zinc-800">
                            {user.createdAt ? format(new Date(user.createdAt), "PP") : "N/A"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <motion.div
                    className="absolute top-6 right-6 flex gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isHovered || isMobile ? 1 : 0, x: isHovered || isMobile ? 0 : 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <Button
                        size="icon"
                        className="bg-amber-500 text-white hover:bg-amber-600 w-10 h-10 rounded-none shadow-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${userId}/edit`);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        className="bg-red-600 text-white hover:bg-red-700 w-10 h-10 rounded-none shadow-xl border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </motion.div>
            </motion.div>
        </>
    );
}
