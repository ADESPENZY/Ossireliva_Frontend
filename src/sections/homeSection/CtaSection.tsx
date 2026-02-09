import { motion } from "motion/react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (

<section className="relative py-32 font-body overflow-hidden bg-black">
  {/* Brand glow backdrop */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-brand/15 via-black to-black" />
    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl" />
    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand/15 rounded-full blur-3xl" />
  </div>

  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      <h2 className="font-heading text-4xl md:text-6xl text-white leading-tight">
        Begin Your Wellness Ritual
      </h2>

      <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
        Thoughtfully crafted essential oil blends designed to bring calm,
        clarity, and balance back into your everyday life.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link
          to="/product"
          className="inline-flex items-center justify-center px-10 py-5 rounded-lg font-semibold text-lg text-brand-foreground
                     bg-gradient-to-r from-brand to-brand-soft
                     hover:from-brand-soft hover:to-brand
                     transition-all transform hover:scale-105
                     shadow-xl shadow-brand/25"
        >
          Shop the Collection
        </Link>

        <Link
          to="/product"
          className="text-white/70 hover:text-white transition-colors text-sm underline underline-offset-4"
        >
          Explore blends & ingredients
        </Link>
      </div>

      <p className="pt-6 text-white/50 text-sm">
        Plant-based • Cruelty-free • Crafted with care
      </p>
    </motion.div>
  </div>
</section>

  )
}

export default CtaSection