import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Clock, Loader2, Eye, EyeOff, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ACCESS_CODE = "Xa876lp-";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [hideDisabledFromCustomers, setHideDisabledFromCustomers] = useState(
    localStorage.getItem("hideDisabledPaymentMethods") === "true"
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem("adminAccessCode");
        
        if (stored === ACCESS_CODE) {
          setAccessGranted(true);
          try {
            const { data: allOrders } = await supabase.from('Order').select('*');
            setOrders(allOrders || []);

            const allMethods = ['paypal', 'applepay', 'venmo', 'cashapp', 'wise', 'zelle', 'revolut', 'chime', 'skrill', 'bitcoin', 'litecoin', 'tether', 'usdc', 'solana', 'ethereum', 'binance'];

            const { data: methods } = await supabase.from('PaymentMethodConfig').select('*');
            const existingMethods = methods || [];
            const missingMethods = allMethods.filter(m => !existingMethods.find(em => em.method === m));

            if (missingMethods.length > 0) {
              await supabase
                .from('PaymentMethodConfig')
                .insert(missingMethods.map(method => ({ method, enabled: true, hidden_from_customers: false })));
            }

            const { data: updatedMethods } = await supabase.from('PaymentMethodConfig').select('*');
            setPaymentMethods(updatedMethods || []);
          } catch (e) {
            console.error('Failed to load data:', e);
            toast.error('Failed to load dashboard data');
          }
        }
        setLoading(false);
      } catch (e) {
        console.error('Error:', e);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (codeInput === ACCESS_CODE) {
      localStorage.setItem("adminAccessCode", ACCESS_CODE);
      setAccessGranted(true);
      setCodeInput("");
      setCodeError("");
    } else {
      setCodeError("Incorrect access code");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setCompleting(orderId);
    const { error } = await supabase
      .from('Order')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    }
    setCompleting(null);
  };

  const handleTogglePaymentMethod = async (methodId) => {
    const config = paymentMethods.find(m => m.id === methodId);
    if (!config) return;
    const newEnabled = !config.enabled;
    setPaymentMethods(paymentMethods.map(m => 
      m.id === methodId ? { ...m, enabled: newEnabled } : m
    ));
    await supabase
      .from('PaymentMethodConfig')
      .update({ enabled: newEnabled })
      .eq('id', methodId);
    toast.success(`${config.method} ${newEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleHideMethod = async (methodId) => {
    const config = paymentMethods.find(m => m.id === methodId);
    if (!config) return;
    const newHidden = !config.hidden_from_customers;
    setPaymentMethods(paymentMethods.map(m => 
      m.id === methodId ? { ...m, hidden_from_customers: newHidden } : m
    ));
    await supabase
      .from('PaymentMethodConfig')
      .update({ hidden_from_customers: newHidden })
      .eq('id', methodId);
    toast.success(`${config.method} ${newHidden ? 'hidden from customers' : 'visible to customers'}`);
  };

  const handleToggleHideDisabled = () => {
    const newValue = !hideDisabledFromCustomers;
    setHideDisabledFromCustomers(newValue);
    localStorage.setItem("hideDisabledPaymentMethods", newValue ? "true" : "false");
    toast.success(newValue ? "Disabled methods hidden from customers" : "Disabled methods shown to customers");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12122a] border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-6"
        >
          <h2 className="text-2xl font-black text-white">Admin Access</h2>
          <p className="text-slate-400">Enter the access code to continue</p>
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Access code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
              />
              {codeError && <p className="text-red-400 text-sm mt-2">{codeError}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
            >
              Unlock
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === "pending");
  const inProgressOrders = orders.filter(o => o.status === "in_progress");
  const completedOrders = orders.filter(o => o.status === "completed");

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "paypal": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "applepay": return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "venmo": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "cashapp": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "wise": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "zelle": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "revolut": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "chime": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "skrill": return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "bitcoin": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "litecoin": return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "tether": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "usdc": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "solana": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "ethereum": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "binance": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const OrderCard = ({ order, isCompleted }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-purple-500/30 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Order #{order.id.slice(-6).toUpperCase()}</h3>
          <p className="text-sm text-slate-400 capitalize">{order.service_type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : order.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-slate-400">Price:</span>
          <span className="text-white font-medium">${order.price?.toFixed(2)}</span>
        </div>
        {order.current_rank && (
          <div className="flex justify-between">
            <span className="text-slate-400">Rank:</span>
            <span className="text-white">{order.current_rank} → {order.desired_rank}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Discord:</span>
          <span className="text-white">{order.discord_username || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Email:</span>
          <span className="text-white">{order.customer_email}</span>
        </div>
        {order.notes && (
          <div>
            <span className="text-slate-400 block mb-1">Notes:</span>
            <span className="text-slate-300">{order.notes}</span>
          </div>
        )}
      </div>

      {!isCompleted && (
        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button
              onClick={() => handleUpdateStatus(order.id, "in_progress")}
              disabled={completing === order.id}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold py-2"
            >
              {completing === order.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  In Progress
                </>
              )}
            </Button>
          )}
          <Button
            onClick={() => handleUpdateStatus(order.id, "completed")}
            disabled={completing === order.id}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2"
          >
            {completing === order.id ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage all orders and track completions</p>
        </div>

        {!loadingMethods && paymentMethods.length > 0 && (
          <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Payment Methods
              </h3>
              <button
                onClick={handleToggleHideDisabled}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  hideDisabledFromCustomers
                    ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                    : 'bg-slate-500/20 border border-slate-500/40 text-slate-300 hover:bg-slate-500/30'
                }`}
              >
                {hideDisabledFromCustomers ? 'Hiding Disabled' : 'Showing All'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="flex-1">
                    <p className="font-semibold capitalize text-white">{method.method}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleHideMethod(method.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        method.hidden_from_customers
                          ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30'
                          : 'bg-slate-500/20 border border-slate-500/40 text-slate-300 hover:bg-slate-500/30'
                      }`}
                    >
                      {method.hidden_from_customers ? '👁️ Hidden' : '👁️ Visible'}
                    </button>
                    <button
                      onClick={() => handleTogglePaymentMethod(method.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        method.enabled
                          ? 'bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30'
                          : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                      }`}
                    >
                      {method.enabled ? '✓ Active' : '✕ Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div></div>
          <Button
            onClick={() => setShowCompleted(!showCompleted)}
            variant="outline"
            className="border-white/10 text-slate-300 hover:text-white gap-2"
          >
            {showCompleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showCompleted ? "Hide" : "Show"} Completed
          </Button>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Pending Orders</h2>
            <span className="ml-auto px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30">
              {pendingOrders.length}
            </span>
          </div>
          {pendingOrders.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No pending orders</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map(order => (
                <OrderCard key={order.id} order={order} isCompleted={false} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">In Progress</h2>
            <span className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-semibold border border-yellow-500/30">
              {inProgressOrders.length}
            </span>
          </div>
          {inProgressOrders.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No in-progress orders</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressOrders.map(order => (
                <OrderCard key={order.id} order={order} isCompleted={false} />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Completed Orders</h2>
                <span className="ml-auto px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-semibold border border-green-500/30">
                  {completedOrders.length}
                </span>
              </div>
              {completedOrders.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No completed orders yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedOrders.map(order => (
                    <OrderCard key={order.id} order={order} isCompleted={true} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}