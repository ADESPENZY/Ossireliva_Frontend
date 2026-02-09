import { motion } from "motion/react";
import { MAIN_PRODUCT } from "../../data/products";

export const HowToUseSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
            How to Use
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Simple daily rituals designed to fit naturally into your routine.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {MAIN_PRODUCT.howToUse.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-6 p-6 rounded-xl
                         bg-white/5 border border-white/10"
            >
              {/* Step Number */}
              <div
                className="w-12 h-12 flex-shrink-0 rounded-full
                           bg-brand/20 text-brand
                           flex items-center justify-center
                           font-semibold text-lg"
              >
                {index + 1}
              </div>

              {/* Text */}
              <p className="text-white/80 text-lg leading-relaxed">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
