import React from "react";
import { Trophy, Swords, Target, Star, Flame, Crown } from "lucide-react";
import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import StarField from "../components/StarField";
import { motion } from "framer-motion";

const SERVICES = [
  {
    id: "ranked",
    title: "Ranked",
    description: "Climb the competitive ladder with our professional players. Fast, safe, and guaranteed results.",
    icon: Swords,
    startingPrice: 1.99,
        gradient: "from-purple-600 to-blue-600",
        popular: true,
  },
  {
    id: "brawler",
    title: "Brawler",
    description: "Push your brawler standing to new heights. Dominate the leaderboards and unlock exclusive rewards.",
    icon: Trophy,
    startingPrice: 0.99,
    gradient: "from-amber-500 to-orange-600",
    popular: false,
  },
  {
    id: "prestige",
    title: "Prestige",
    description: "Start your season strong. We'll secure the highest starting prestige for your account.",
    icon: Target,
    startingPrice: 29.99,
    gradient: "from-cyan-500 to-teal-600",
    popular: false,
  },
  {
    id: "trophies",
    title: "Trophies",
    description: "Need a specific trophy count? We guarantee the trophies you need at the rank you're at.",
    icon: Star,
    startingPrice: 5.99,
    gradient: "from-pink-500 to-rose-600",
    popular: false,
  },
  {
    id: "winstreak",
    title: "Winstreak",
    description: "Build an impressive winstreak with our pro boosters playing in real-time alongside you.",
    icon: Flame,
    startingPrice: 22.99,
    gradient: "from-orange-500 to-red-600",
    popular: false,
  },
  {
    id: "matcherino",
    title: "Matcherino",
    description: "One-on-one sessions with elite players. Get personalized tips to improve your gameplay fast.",
    icon: Crown,
    startingPrice: 249.99,
    gradient: "from-violet-500 to-purple-700",
    popular: false,
  },
];

export default function Home() {
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <HeroSection />

      <section className="relative px-6 pb-24 -mt-8">
                <StarField />
                <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Our Services
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Choose a service below and get an instant price quote.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="px-6 pb-24 relative">
        <div className="absolute inset-0 -top-32 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: "536", label: "Vouches" },
              { number: "99.8%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Live Support" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-8 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-violet-500/5 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-4xl font-black bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent relative z-10">
                  {stat.number}
                </p>
                <p className="text-slate-400 text-sm mt-2 relative z-10">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="px-6 pb-24 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white">
              What Our Customers Say
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Join hundreds of satisfied players who've improved their game with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "mason.lee",
                amount: "$25.50",
                rating: 5,
                comment: "vouch fast push super fast and efficient"
              },
              {
                name: "jordanm_",
                amount: "$10.99",
                rating: 5,
                comment: "vouch another fast push great service 10/10"
              },
              {
                name: "calebmartin",
                amount: "$3.50",
                rating: 5,
                comment: "really fast and nice service recommended💪🏽💪🏽"
              },
              {
                name: "noah_k",
                amount: "$14.99",
                rating: 5,
                comment: "fast rank push, i'd 100% recommend"
              },
              {
                name: "tylerbennett",
                amount: "$6.99",
                rating: 5,
                comment: "very nice in game purchases, quick and cheaper than what it costs in game"
              },
              {
                name: "elijah.r",
                amount: "$69.99",
                rating: 5,
                comment: "i got a new account. they are trustworthy, like i was nervous but they didnt scam me. 100/10"
              },
              {
                name: "lucasw_",
                amount: "$12.99",
                rating: 5,
                comment: "amazing service and really fast. i would recommend"
              },
              {
                name: "rawinput",
                amount: "$22.99",
                rating: 5,
                comment: "fast and nice booster would recommend ❤️"
              },
              {
                name: "nightindex",
                amount: "$12.99",
                rating: 5,
                comment: "fast boost would recommend 👍"
              },
              {
                name: "coldpacket",
                amount: "$12.99",
                rating: 5,
                comment: "no scam fast boost would definitely recommend"
              },
              {
                name: "revix",
                amount: "$234.99",
                rating: 5,
                comment: "m2 to pro done super fast"
              },
              {
                name: "solra",
                amount: "$34.99",
                rating: 5,
                comment: "great and efficient boost, would recommend"
              },
              {
                name: "zentra",
                amount: "$35.99",
                rating: 5,
                comment: "fastest boost 🔥🔥🔥"
              },
              {
                name: "noviq",
                amount: "$22.50",
                rating: 5,
                comment: "+ vouch fast brawler rank up"
              },
              {
                name: "mason.lee",
                amount: "$34.99",
                rating: 5,
                comment: "+vouch 1 prestige of choice. never disappointed when buying boosts from him. 100% recommend! 10/10"
              },
              {
                name: "jordanm_",
                amount: "$75.99",
                rating: 5,
                comment: "fast, really nice and cheap, got me 1 global nita"
              },
              {
                name: "calebmartin",
                amount: "$12.99",
                rating: 5,
                comment: "trophie push was completed within a few hours"
              },
              {
                name: "noah_k",
                amount: "$269.99",
                rating: 5,
                comment: "honestly very good service. great support. good booster. very understand staffs"
              },
              {
                name: "tylerbennett",
                amount: "$84.99",
                rating: 5,
                comment: "one of the fastest boost ever from masters 2 to 3 took half a day definitely recommend"
              },
              {
                name: "elijah.r",
                amount: "$305.99",
                rating: 5,
                comment: "i got pro ranked finally. the service is excellent and reliable. i highly recommend it 👍💪"
              },
              {
                name: "lucasw_",
                amount: "$44.99",
                rating: 5,
                comment: "once again mythic to masters, everything went perfect, took one day"
              },
              ].slice(0, showAllReviews ? undefined : 6).map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">{review.name}</p>
                    <p className="text-purple-400 text-xs font-semibold">{review.amount}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
            </div>
            <div className="text-center mt-6">
              <motion.button
                onClick={() => setShowAllReviews(!showAllReviews)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 text-sm font-semibold transition-all duration-300"
              >
                {showAllReviews ? "Show Less" : "Show More"}
              </motion.button>
            </div>
            </div>
            </section>
            </div>
            );
            }