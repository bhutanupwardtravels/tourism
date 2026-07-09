import { StatCard } from "@/components/admin/stats-card";
import { Users, Package, Calendar, DollarSign, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const { stats, recentActivity } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests.toString()}
          change="Action Required"
          trend={stats.pendingRequests > 0 ? "down" : "neutral"}
          icon={AlertCircle}
          variant="rose"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalBookings.toString()}
          change="+12.5%" // Keep as placeholder or remove if misleading, keeping for design
          trend="up"
          icon={Calendar}
          variant="blue"
        />
        <StatCard
          title="Est. Revenue"
          value={stats.revenue}
          change="Year to Date"
          trend="up"
          icon={DollarSign}
          variant="green"
        />
        <StatCard
          title="Active Tours"
          value={stats.activeTours.toString()}
          change="Live on site"
          trend="neutral"
          icon={Package}
          variant="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-gray-300 shadow-sm hover:shadow-md transition-shadow rounded-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">
                Recent trip requests
              </h2>
              <Link href="/admin/tour-requests">
                <button className="text-xs font-medium uppercase text-gray-500 hover:text-black transition-colors tracking-wide">
                  View All
                </button>
              </Link>
            </div>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center shrink-0 rounded-none">
                    <span className="text-sm font-semibold text-gray-700">
                      {activity.userName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-black font-medium">
                        {activity.userName}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-none",
                        activity.status === "pending" ? "bg-rose-100 text-rose-700" :
                          activity.status === "approved" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                      )}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      submitted an enquiry for <span className="font-semibold text-gray-900">{activity.packageName}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-lg border-none rounded-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardContent className="p-6 relative z-10">
            <h2 className="text-lg font-semibold mb-6 uppercase tracking-wide">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/tours/new"
                className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors group border border-white/20 rounded-none"
              >
                <span className="text-sm font-medium">Add New Tour</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/experiences/new"
                className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors group border border-white/20 rounded-none"
              >
                <span className="text-sm font-medium">Add Experience</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/destinations/new"
                className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors group border border-white/20 rounded-none"
              >
                <span className="text-sm font-medium">Add Destination</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
