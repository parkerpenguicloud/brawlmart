import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowLeft, ShoppingCart, Trophy, Swords, Target, Star, Flame, Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import RankSelector from "../components/RankSelector";
import Power11Selector from "../components/Power11Selector";
import PriceCalculator, { calculatePrice } from "../components/PriceCalculator";
import BrawlerCalculator from "../components/service-calculators/BrawlerCalculator";
import TrophiesCalculator from "../components/service-calculators/TrophiesCalculator";
import WinstreakCalculator from "../components/service-calculators/WinstreakCalculator";
import PrestigeCalculator from "../components/service-calculators/PrestigeCalculator";
import MatcherinoCalculator from "../components/service-calculators/MatcherinoCalculator";
import { toast } from "sonner";

const SERVICE_INFO = {
  ranked: {
    title: "Ranked",
    description: "Our professional players will climb the competitive ladder on your account safely and efficiently.",
    icon: Swords,
    gradient: "from-purple-600 to-blue-600",
    features: ["VPN Protection", "Offline Mode Available", "Live Chat with Booster", "Scheduled Play Times"],
  },
  brawler: {
    title: "Brawler",
    description: "Push your brawler standing to new heights. Dominate the leaderboards and unlock exclusive rewards.",
    icon: Trophy,
    gradient: "from-amber-500 to-orange-600",
    features: ["Trophy Guarantee", "Progress Tracking", "Fast Completion", "Priority Queue"],
  },
  prestige: {
    title: "Prestige",
    description: "Start your season strong. We'll secure the highest starting prestige for your account.",
    icon: Target,
    gradient: "from-cyan-500 to-teal-600",
    features: ["High Win Rate", "Season Start Priority", "Rank Guarantee", "Detailed Report"],
  },
  trophies: {
    title: "Trophies",
    description: "Need a specific trophy count? We guarantee the trophies you need at the rank you're at.",
    icon: Star,
    gradient: "from-pink-500 to-rose-600",
    features: ["Guaranteed Wins", "Flexible Schedule", "Account Safety", "24/7 Support"],
  },
  winstreak: {
    title: "Winstreak",
    description: "Build an impressive winstreak with our pro boosters playing in real-time alongside you.",
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    features: ["Play Together", "Learn in Real-Time", "Voice Chat Available", "Flexible Schedule"],
  },
  matcherino: {
    title: "Matcherino",
    description: "One-on-one sessions with elite players. Get personalized tips to improve your gameplay fast.",
    icon: Crown,
    gradient: "from-violet-500 to-purple-700",
    features: ["Personalized Tips", "VOD Review", "Custom Strategy", "Elite Coaches"],
  },
};

export default function ServiceDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("service") || "ranked";
  const service = SERVICE_INFO[serviceId];

  const [currentRank, setCurrentRank] = useState("D1");
  const [desiredRank, setDesiredRank] = useState("D2");
  const [p11Count, setP11Count] = useState(12);

  const [servicePrice, setServicePrice] = useState(0);
  const [serviceDesc, setServiceDesc] = useState("");

  const [notes, setNotes] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDiscordCheck, setShowDiscordCheck] = useState(false);
  const [verifyingDiscord, setVerifyingDiscord] = useState(false);
  const [discordError, setDiscordError] = useState("");

  const [showP11Modal, setShowP11Modal] = useState(false);

  const mastersTiers = ["MA1", "MA2", "MA3", "PRO"];
  const needsP11 = serviceId === "ranked" && mastersTiers.includes(desiredRank);

  const rankedPrice = calculatePrice(currentRank, null, desiredRank, null, p11Count);
  const price = serviceId === "ranked" ? rankedPrice : servicePrice;

  const Icon = service?.icon || Swords;

  const handleOrderClick = () => {
    if (price <= 0) {
      toast.error("Please configure your order first");
      return;
    }
    if (!discordUsername) {
      toast.error("Please enter your exact Discord username");
      return;
    }
    setShowDiscordCheck(true);
  };

  const handleOrder = async () => {
    if (!customerEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubmitting(true);

    const { data: newOrder, error } = await supabase
      .from('Order')
      .insert([{
        service_type: serviceId,
        current_rank: serviceId === "ranked" ? currentRank : "",
        desired_rank: serviceId === "ranked" ? desiredRank : "",
        price,
        status: "pending",
        payment_status: "unpaid",
        customer_email: customerEmail,
        discord_username: discordUsername,
        notes,
      }])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create order");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    window.location.href = createPageUrl("Payment") + `?order=${newOrder.id}`;
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <p className="text-white">Service not found</p>
      </div>
    );
  }

  const renderCalculator = () => {
    switch (serviceId) {
      case "ranked":
        return (
          <RankSelector
            currentRank={currentRank}
            setCurrentRank={setCurrentRank}
            desiredRank={desiredRank}
            setDesiredRank={setDesiredRank}
          />
        );
      case "brawler":
        return (
          <BrawlerCalculator
            onPriceChange={(p, from, to) => {
              setServicePrice(p);
              setServiceDesc(`${from} → ${to} trophies`);
            }}
          />
        );
      case "trophies":
        return (
          <TrophiesCalculator
            onPriceChange={(p, from, to) => {
              setServicePrice(p);
              setServiceDesc(`${from} → ${to} trophies`);
            }}
          />
        );
      case "winstreak":
        return (
          <WinstreakCalculator
            onPriceChange={(p, idx) => {
              setServicePrice(p);
              setServiceDesc(idx !== null ? `${[50,69,101,111,125,200][idx]} wins` : "");
            }}
          />
        );
      case "prestige":
        return (
          <PrestigeCalculator
            onPriceChange={(p, qty) => {
              setServicePrice(p);
              setServiceDesc(`${qty} prestige(s)`);
            }}
          />
        );
      case "matcherino":
        return (
          <MatcherinoCalculator
            onPriceChange={(p, idx) => {
              setServicePrice(p);
              setServiceDesc(idx !== null ? ["60-70","70-80","80-90","90+"][idx] + " trophies" : "");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#111133] to-[#0a0a1a]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Services</span>
          </Link>

          <div className="flex items-center gap-4 flex-nowrap">
            <div className="mb-0 flex-shrink-0">
              {serviceId === "ranked" && <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6999f53ad08cd24adf9a82be/df5bd3ab1_image-removebg-preview.png" alt="Ranked" className="w-24 h-24" />}
              <h1 className="text-4xl font-black text-white">{service.title}</h1>
              <p className="text-slate-400 mt-1">{service.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {service.features.map((f) => (
              <div key={f} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-slate-300 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {renderCalculator()}
          </div>

          <div className="space-y-6">
            {serviceId === "ranked" && (
              <PriceCalculator
                currentRank={currentRank}
                desiredRank={desiredRank}
                p11Count={p11Count}
              />
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Complete Order</h3>
              <Input
                placeholder="Your exact Discord username *"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
              />
              <Input
                placeholder="Email address *"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50"
              />
              <Textarea
                placeholder="Special instructions (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 resize-none h-20"
              />

              <Button
                onClick={handleOrderClick}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-base rounded-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Place Order — ${price.toFixed(2)}
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-600 text-center">
                You'll choose your payment method on the next step
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDiscordCheck && (
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
              <h3 className="text-lg font-bold text-white">Hold up!</h3>
              <p className="text-slate-400">
                You need to join our Discord server to place an order. Our staff will message you there with payment details and to start your boost.
              </p>
              <p className="text-sm text-slate-500">
                Have you already joined our Discord? If not, visit <a href="https://discord.gg/brwl" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">discord.gg/brwl</a> first.
              </p>
              {discordError && (
                <p className="text-sm text-red-400">{discordError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiscordCheck(false)}
                  className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setVerifyingDiscord(true);
                    setDiscordError("");
                    const { data, error } = await supabase.functions.invoke('verify-discord-member', {
                      body: { username: discordUsername }
                    });

                    if (error || !data.found) {
                      setDiscordError("Hmm.. we can't find your username in our server. Are you sure you entered it right and joined?");
                      setVerifyingDiscord(false);
                      return;
                    }

                    setVerifyingDiscord(false);
                    setShowDiscordCheck(false);
                    if (needsP11) {
                      setShowP11Modal(true);
                    } else {
                      handleOrder();
                    }
                  }}
                  disabled={isSubmitting || verifyingDiscord}
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {verifyingDiscord ? "Checking..." : "Yes, I've Joined"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showP11Modal && (
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">How many Power 11 Brawlers do you have?</h3>
                <button onClick={() => setShowP11Modal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-400">This affects the price for Masters+ ranks.</p>
              <Power11Selector count={p11Count} onChange={setP11Count} />
              <div className="pt-2 text-center">
                <p className="text-2xl font-black text-white mb-1">${calculatePrice(currentRank, null, desiredRank, null, p11Count).toFixed(2)}</p>
                <p className="text-xs text-slate-500 mb-4">Updated price with your brawler count</p>
              </div>
              <Button
                onClick={() => { setShowP11Modal(false); handleOrder(); }}
                disabled={isSubmitting || !customerEmail}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl"
              >
                {!customerEmail ? "Enter your email first" : `Confirm & Place Order`}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}