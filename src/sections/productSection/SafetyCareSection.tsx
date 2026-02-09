import { motion } from "motion/react";
import { MAIN_PRODUCT } from "../../data/products";

export const SafetyCareSection = () => {
  return (
    <section className="pt-16 pb-24 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
            Safety & Care
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Thoughtfully formulated for daily use, with care instructions
            to help you enjoy every drop safely.
          </p>
        </motion.div>

        {/* Safety Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAIN_PRODUCT.safetyInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-white/70 text-sm leading-relaxed">
                {info}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
