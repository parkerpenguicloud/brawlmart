import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { PayPalParticles, ApplePayParticles, PaymentParticles } from "../components/PaymentParticles";

const PAYMENT_METHODS = [
  {
    id: "paypal",
    label: "PayPal",
    emoji: "💙",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/6e2005118_paypal.png",
  },
  {
    id: "applepay",
    label: "Apple Pay",
    emoji: "🍎",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/0b364e30a_applepay.png",
  },
  {
    id: "venmo",
    label: "Venmo",
    emoji: "💳",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/f2dbb7455_venmo.png",
  },
  {
    id: "cashapp",
    label: "Cash App",
    emoji: "💵",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/6521c23fb_cashapp.png",
  },
  {
    id: "wise",
    label: "Wise",
    emoji: "🌍",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/99de22db8_wise.png",
  },
  {
    id: "zelle",
    label: "Zelle",
    emoji: "🏦",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/c383dfe38_zelle.png",
  },
  {
    id: "revolut",
    label: "Revolut",
    emoji: "💰",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/14fdab30d_revoult.png",
  },
  {
    id: "chime",
    label: "Chime",
    emoji: "🔔",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/2dcc480f8_1chime.png",
  },
  {
    id: "skrill",
    label: "Skrill",
    emoji: "📱",
    color: "bg-gradient-to-br from-purple-900/60 to-purple-950/60 border-purple-700/70",
    hoverColor: "hover:from-purple-800/70 hover:to-purple-900/70 hover:border-purple-600/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/53299a69e_skrill.png",
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    emoji: "₿",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
  },
  {
    id: "litecoin",
    label: "Litecoin",
    emoji: "Ł",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/c1fe18936_image.png",
  },
  {
    id: "tether",
    label: "Tether",
    emoji: "₮",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/c062ff794_usdt.png",
  },
  {
    id: "usdc",
    label: "USDC",
    emoji: "🪙",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/703d6551f_usdc.png",
  },
  {
    id: "solana",
    label: "Solana",
    emoji: "◎",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/399a1e6fd_solana.png",
  },
  {
    id: "ethereum",
    label: "Ethereum",
    emoji: "Ξ",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/...ethereum.png",
  },
];

export default function Payment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hideDisabledMethods, setHideDisabledMethods] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) {
        toast.error("No order found");
        setLoading(false);
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('Order')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        toast.error("Order not found");
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: methodsData, error: methodsError } = await supabase
        .from('PaymentMethodConfig')
        .select('*');

      if (methodsError) {
        toast.error("Failed to load payment methods");
      } else {
        setPaymentMethods(methodsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [orderId]);

  const handlePaymentMethodClick = (methodId) => {
    setSelectedMethod(methodId);
    setShowConfirmation(true);
  };

  const handleConfirmPaymentMethod = async () => {
    if (!selectedMethod || !order) return;

    setSubmitting(true);

    const { error } = await supabase
      .from('Order')
      .update({
        payment_method: selectedMethod,
        payment_status: "pending_verification"
      })
      .eq('id', order.id);

    if (error) {
      toast.error("Failed to update order");
      setSubmitting(false);
      return;
    }

    await supabase.functions.invoke('create-discord-ticket', {
      body: {
        event: { type: 'update' },
        data: {
          id: order.id,
          payment_method: selectedMethod,
          status: "pending",
          discord_channel_id: order.discord_channel_id,
          discord_username: order.discord_username,
          customer_name: order.customer_email.split('@')[0],
          service_type: order.service_type,
          price: order.price,
          notes: order.notes,
          current_rank: order.current_rank,
          desired_rank: order.desired_rank
        }
      }
    });

    setShowConfirmation(false);
    setPaid(true);
    setSubmitting(false);
    toast.success("Ticket created! Check Discord for payment details.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center flex-col gap-6">
        <p className="text-white text-xl">Order not found</p>
        <Link to={createPageUrl("Home")}>
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center flex-col gap-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          </div>
        </div>
        <p className="text-white font-bold text-lg">Processing Your Order...</p>
        <p className="text-slate-400 text-sm">Please don't refresh the page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="w-full px-6">
        <div className="max-w-2xl mx-auto pt-12">
          <Link
            to={createPageUrl("ServiceDetail") + `?service=${order.service_type}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>

        {!paid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative"
          >
            <PaymentParticles />

            <div className="text-center mb-12 relative z-10">
              <h1 className="text-4xl font-black text-white mb-2">Complete Payment</h1>
              <p className="text-slate-400">Order total: <span className="text-white font-bold text-3xl">${order.price?.toFixed(2)}</span></p>
            </div>

            <div className="grid gap-4 w-full max-w-4xl relative z-10"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                justifyContent: "center",
                placeItems: "center"
              }}>
              <style>{`
                @media (max-width: 1024px) {
                  div[style*="gridTemplateColumns"] > :nth-child(n+9) {
                    grid-column: 2 / 6;
                  }
                }
              `}</style>
              {PAYMENT_METHODS.filter(m => {
                const config = paymentMethods.find(pm => pm.method === m.id);
                const isEnabled = config?.enabled !== false;
                const isHidden = config?.hidden_from_customers === true;
                return hideDisabledMethods ? (isEnabled && !isHidden) : !isHidden;
              }).map((m) => {
                const config = paymentMethods.find(pm => pm.method === m.id);
                const isEnabled = config?.enabled !== false;
                return (
                  <motion.button
                    key={m.id}
                    onClick={() => isEnabled && handlePaymentMethodClick(m.id)}
                    disabled={!isEnabled}
                    whileHover={isEnabled ? { scale: 1.05 } : {}}
                    whileTap={isEnabled ? { scale: 0.95 } : {}}
                    className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all duration-200 relative group overflow-hidden w-full aspect-square ${
                      isEnabled
                        ? `bg-gradient-to-br from-purple-950/80 to-purple-1000/80 border-purple-800/50 cursor-pointer shadow-lg shadow-purple-500/20 hover:from-purple-900/80 hover:to-purple-950/80 hover:border-purple-700/60`
                        : 'border-slate-600/30 bg-slate-800/10 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {isEnabled && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                    <div className="flex items-center justify-center relative z-10">
                      <img src={m.logo} alt={m.label} className={`object-contain max-w-[90%] ${['paypal', 'cashapp', 'tether'].includes(m.id) ? 'h-24 w-24' : 'h-20 w-20'}`} />
                    </div>
                    <span className={`text-sm font-bold text-center leading-tight relative z-10 ${m.textColor}`}>{m.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {paid && (
          <div className="min-h-screen flex items-center justify-center flex-col gap-6 text-center">
            <Check className="w-24 h-24 text-green-500" />
            <h1 className="text-4xl font-black text-white">Order Placed!</h1>
            <p className="text-slate-300 max-w-md">
              We've created a ticket in our Discord server. Our staff will send you payment instructions shortly.
            </p>
            <Link to="https://discord.gg/brwl" target="_blank">
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                Join Discord & Check Ticket
              </Button>
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#12122a] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-5"
            >
              <h3 className="text-lg font-bold text-white">Confirm Payment Method</h3>
              <p className="text-slate-400">
                We'll open a ticket in Discord and our staff will send you payment details for <span className="text-white font-bold">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPaymentMethod}
                  disabled={submitting}
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {submitting ? "Opening ticket..." : "Yes, Continue"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}