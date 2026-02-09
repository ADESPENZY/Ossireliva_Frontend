import { Leaf } from "lucide-react";
import { motion } from "motion/react";
import productImage2 from "../../assets/1bc5f85c823f68013718c4f317566b3c9523b737.png";
import { MAIN_PRODUCT } from "../../data/products";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export function StorySection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden font-body">
      {/* Ambient background */}
      <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-brand/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10">
        {/* Intro */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mb-24"
        >
          <p className="text-brand text-sm uppercase tracking-wide mb-4">
            Our story
          </p>

          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
            A return to
            <br />
            intentional care
          </h2>

          <p className="text-white/70 text-lg leading-relaxed">
            Ossireliva was created from a quiet realization —
            that modern wellness had become loud, rushed, and disconnected
            from the simplicity it once promised.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text narrative */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-white/70 leading-relaxed text-lg">
              {MAIN_PRODUCT.longDescription}
            </p>

            <p className="text-white/70 leading-relaxed text-lg">
              Each Ossireliva blend begins with respect —
              for the plants, the process, and the people who use it.
              We work with trusted growers and ethical sources, choosing
              ingredients not for trends, but for how they feel in daily life.
            </p>

            <p className="text-white/60 leading-relaxed">
              The result is care that feels grounded, calm, and personal —
              something you return to, not rush through.
            </p>

            {/* Value highlight */}
            <div className="flex items-start gap-5 pt-6">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-brand" />
              </div>

              <div>
                <div className="text-white font-medium mb-1">
                  Sustainably sourced
                </div>
                <div className="text-white/60 text-sm leading-relaxed">
                  Every ingredient is chosen with care — respecting nature,
                  communities, and long-term balance.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-brand/10 rounded-[32px] blur-3xl" />
            <img
              src={productImage2}
              alt="Ossireliva product detail"
              className="relative rounded-2xl shadow-2xl w-full max-h-[600px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
