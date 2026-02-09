import { motion } from "motion/react";

const principles = [
  {
    title: "Plant-based, always",
    desc: "We use botanical ingredients chosen for how they feel on the body — never synthetic fillers, never unnecessary additives.",
  },
  {
    title: "Designed with intention",
    desc: "Every blend begins with a purpose: calm, grounding, clarity, or rest. Nothing is accidental.",
  },
  {
    title: "Crafted in small batches",
    desc: "Blended in limited quantities to preserve freshness, aroma, and integrity — the way wellness should be.",
  },
  {
    title: "Made for daily rituals",
    desc: "Not reserved for special moments. Ossireliva is designed to fit gently into everyday life.",
  },
];

const DifferentSection = () => {
  return (
    <section className="relative py-28 bg-black overflow-hidden">
      {/* Ambient background */}
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-brand/10 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-20 items-start">
        
        {/* LEFT — BELIEF / STATEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="text-brand text-sm uppercase tracking-wide">
            Our approach
          </p>

          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Designed for
            <br />
            real wellness
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-xl">
            Ossireliva was never meant to be loud, trendy, or complicated.
            It exists for people who want care that feels calm, grounded,
            and intentional — without excess.
          </p>

          <p className="text-white/60 text-base leading-relaxed max-w-xl">
            Every decision we make, from ingredients to formulation,
            follows one question:
            <br />
            <span className="text-white">
              “Would this feel good as part of a daily ritual?”
            </span>
          </p>
        </motion.div>

        {/* RIGHT — PRINCIPLES (NOT BOXES) */}
        <div className="space-y-10">
          {principles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex gap-6"
            >
              {/* Index marker */}
              <div className="text-brand font-heading text-xl">
                0{index + 1}
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-white text-lg font-medium">
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentSection;
