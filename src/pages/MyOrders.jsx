import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  in_progress: { label: "In Progress", icon: Loader2, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const serviceLabels = {
  ranked_boost: "Ranked Boost",
  trophy_boost: "Trophy Boost",
  placement_matches: "Placement Matches",
  win_boost: "Win Boost",
  duo_boost: "Duo Boost",
  coaching: "Coaching",
};

export default function MyOrders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => base44.entities.Order.list("-created_date"),
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">My Orders</h1>
        <p className="text-slate-500 mb-10">Track your boosting orders</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                >
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">{serviceLabels[order.service_type] || order.service_type}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {order.current_rank} → {order.desired_rank}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${status.color} border flex items-center gap-1.5 px-3 py-1`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </Badge>
                    <p className="text-xl font-black text-white">${order.price?.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}