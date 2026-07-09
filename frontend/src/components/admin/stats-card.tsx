import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
    variant?: "default" | "blue" | "green" | "amber" | "purple" | "rose";
}

const variants = {
    default: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: "text-gray-700",
    },
    blue: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: "text-blue-600",
    },
    green: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: "text-green-600",
    },
    amber: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: "text-amber-600",
    },
    purple: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: "text-purple-600",
    },
    rose: {
        bg: "bg-rose-100",
        text: "text-rose-700",
        icon: "text-rose-600",
    },
};

export function StatCard({ title, value, change, trend, icon: Icon, variant = "default" }: StatCardProps) {
    const styles = variants[variant] || variants.default;

    return (
        <Card className={cn(
            "shadow-sm hover:shadow-md transition-shadow rounded-none border-t-4",
            variant === "default" && "border-t-transparent",
            variant === "blue" && "border-t-blue-500",
            variant === "green" && "border-t-green-500",
            variant === "amber" && "border-t-amber-500",
            variant === "purple" && "border-t-purple-500",
            variant === "rose" && "border-t-rose-500"
        )}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {title}
                    </span>
                    <div className={cn("w-10 h-10 flex items-center justify-center rounded-none", styles.bg)}>
                        <Icon className={cn("w-5 h-5", styles.icon)} />
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-semibold text-black">{value}</h3>
                    {change && (
                        <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-none",
                            trend === "up" ? "bg-green-50 text-green-700" :
                                trend === "down" ? "bg-red-50 text-red-700" :
                                    "bg-gray-100 text-gray-700"
                        )}>
                            {change}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
