import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { MAIN_PRODUCT } from "../../data/products";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const BenefitsSection = () => {
  return (
    <section className="relative py-32 bg-black font-body overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-brand/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10">
        {/* Top intro */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-3xl mb-24"
        >
          <p className="text-brand text-sm uppercase tracking-wide mb-4">
            The Ossireliva Difference
          </p>

          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
            Wellness, without
            <br />
            the noise
          </h2>

          <p className="text-white/70 text-lg leading-relaxed">
            Ossireliva isn’t built on trends or exaggerated promises.
            It’s shaped around how care should feel — slow, honest,
            and easy to return to.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* LEFT — Benefits flow */}
          <div className="space-y-16">
            {MAIN_PRODUCT.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-6"
              >
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-brand" />
                </div>

                <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>

          {/* RIGHT — Ritual Manifesto */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm">
              <p className="text-white/40 text-sm uppercase tracking-wide mb-6">
                A Gentle Philosophy
              </p>

              <div className="space-y-6">
                <p className="text-white text-2xl font-heading leading-snug">
                  Calm is not something
                  <br />
                  you chase.
                </p>

                <p className="text-white/70 leading-relaxed">
                  It’s something you return to — through small, intentional
                  moments of care.
                </p>

                <div className="h-px bg-white/10 my-6" />

                <p className="text-white/60 leading-relaxed">
                  Every Ossireliva blend is designed to fit naturally into
                  your rhythm, not disrupt it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
