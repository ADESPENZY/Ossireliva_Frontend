import { motion } from "motion/react";
import { MAIN_PRODUCT } from "../../data/products";

export const IngredientsSection = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
            What’s Inside
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every ingredient is carefully selected for purity, effectiveness,
            and harmony with your body.
          </p>
        </motion.div>

        {/* Ingredients Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {MAIN_PRODUCT.ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-xl border border-white/10
                         bg-white/5 backdrop-blur-sm
                         hover:border-brand/40
                         transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="w-3 h-3 mt-2 rounded-full bg-brand flex-shrink-0" />
                <p className="text-white/80 leading-relaxed">
                  {ingredient}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
