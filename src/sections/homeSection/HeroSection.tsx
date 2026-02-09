import { motion } from "motion/react";
import { Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import productImage1 from "../../assets/83a00bb364b2616a6523d5536a850f3da94a4d73.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (

<section className="relative min-h-screen flex items-center justify-center overflow-hidden font-body bg-black">
  {/* Brand gradient background */}
  <div className="absolute inset-0 z-0 bg-brand-gradient-soft" />

  {/* Brand glow accents */}
  <motion.div
    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
    transition={{ duration: 9, repeat: Infinity }}
    className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl"
  />
  <motion.div
    animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
    transition={{ duration: 11, repeat: Infinity }}
    className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl"
  />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Text */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/15 border border-brand/30 text-brand">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Pure Botanical Aromatherapy</span>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl text-white leading-tight">
          Wellness, Designed by Nature.
          <span className="block text-brand mt-2">
            Refined for Daily Rituals.
          </span>
        </h1>

        <p className="text-xl text-white/70 leading-relaxed max-w-xl">
          Thoughtfully blended essential oils created to calm the mind,
          restore balance, and elevate the moments that matter most.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/product"
            className="px-8 py-4 bg-brand hover:brightness-110 text-brand-foreground font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-brand/30 flex items-center justify-center gap-2"
          >
            Explore the Collection
            <ChevronRight className="w-5 h-5" />
          </Link>

          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-all backdrop-blur-sm border border-white/20">
            Learn Our Process
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-10">
          <div>
            <div className="text-3xl font-semibold text-brand">100%</div>
            <div className="text-white/60 text-sm">Plant-Based</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-brand">6+</div>
            <div className="text-white/60 text-sm">Signature Blends</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-brand">5★</div>
            <div className="text-white/60 text-sm">Customer Loved</div>
          </div>
        </div>
      </motion.div>

      {/* Product */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <img
            src={productImage1}
            alt="Ossireliva Essential Oil"
            className="w-full max-w-lg mx-auto drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  </div>
</section>

  );
}
