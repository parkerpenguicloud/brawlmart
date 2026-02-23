import React, { useState, useEffect } from "react";
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
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/bdec46837_ethereum.png",
  },
  {
    id: "binance",
    label: "Binance",
    emoji: "⬜",
    color: "bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400/60",
    hoverColor: "hover:from-purple-500/50 hover:to-purple-600/50 hover:border-purple-300/80",
    textColor: "text-white",
    logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/593a7e353_binance.png",
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
  const [hideDisabledMethods, setHideDisabledMethods] = useState(
    localStorage.getItem("hideDisabledPaymentMethods") === "true"
  );

  useEffect(() => {
    if (!orderId) {
      window.location.href = createPageUrl("Home");
      return;
    }

    const fetchData = async () => {
      try {
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
      } catch (err) {
        toast.error("Error loading data");
        setLoading(false);
      }
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

    try {
      const { error } = await supabase
        .from('Order')
        .update({
          payment_method: selectedMethod,
          payment_status: "pending_verification"
        })
        .eq('id', order.id);

      if (error) throw error;

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
      toast.success("Ticket created! Check Discord for payment details.");
    } catch (error) {
      toast.error("Failed to process payment method");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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

  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
  const orderNumber = orderId ? orderId.slice(-6).toUpperCase() : "------";

  if (paid) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">A Ticket Has Been Opened For You!</h2>

          <div className="my-6 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm text-slate-400 mb-1">Your Order Number</p>
            <p className="text-4xl font-black text-white tracking-widest">#{orderNumber}</p>
            <p className="text-xs text-slate-500 mt-2">Your order has been placed and payment is awaiting verification.</p>
          </div>

          <a
            href="https://discord.gg/brwl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 mb-6 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold hover:bg-purple-500/30 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Open Ticket
          </a>
          <br />
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white">
              Back to Home
            </Button>
          </Link>
        </motion.div>
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

            <div className="grid gap-4 w-full max-w-4xl relative z-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                    className={`flex flex-col items-center justify-center gap-2 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-200 relative group overflow-hidden w-full min-h-[120px] sm:min-h-[140px] ${
                      isEnabled
                        ? `bg-gradient-to-br from-purple-950/80 to-purple-1000/80 border-purple-800/50 cursor-pointer shadow-lg shadow-purple-500/20 hover:from-purple-900/80 hover:to-purple-950/80 hover:border-purple-700/60`
                        : 'border-slate-600/30 bg-slate-800/10 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    {isEnabled && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                    <div className="flex items-center justify-center relative z-10">
                      <img 
                        src={m.logo} 
                        alt={m.label} 
                        className="object-contain w-16 h-16 sm:w-20 sm:h-20 max-w-full h-auto mx-auto" 
                      />
                    </div>
                    <span className={`text-sm font-bold text-center leading-tight relative z-10 ${m.textColor}`}>{m.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

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
    </div>
  );
}
