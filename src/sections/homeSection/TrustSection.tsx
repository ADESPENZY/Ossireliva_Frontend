import { motion } from "motion/react";
import { ShieldCheck, Leaf, Award, Heart } from "lucide-react";

const TrustSection = () => {
  return (

    <section className="relative py-20 bg-black font-body overflow-hidden">
        {/* Soft brand ambience */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-brand-soft/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section intro */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
            >
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-5">
                Crafted with Care. Backed by Trust.
            </h2>
            <p className="text-lg text-white/65 max-w-3xl mx-auto">
                Every Ossireliva blend is created with intention — prioritizing safety,
                purity, and long-term well-being.
            </p>
            </motion.div>

            {/* Badges */}
            <div className="grid md:grid-cols-4 gap-12">
            {[
                {
                icon: ShieldCheck,
                title: "Safety First",
                desc: "Dermatologist reviewed and carefully tested",
                },
                {
                icon: Leaf,
                title: "100% Plant-Based",
                desc: "Pure botanical ingredients, no fillers",
                },
                {
                icon: Award,
                title: "Quality Driven",
                desc: "Crafted to meet high formulation standards",
                },
                {
                icon: Heart,
                title: "Cruelty-Free",
                desc: "Never tested on animals — ever",
                },
            ].map((badge, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-center group"
                >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-brand/15 group-hover:bg-brand/25 transition-all">
                    <badge.icon className="w-10 h-10 text-brand" />
                </div>

                <h3 className="text-white font-medium mb-2">
                    {badge.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                    {badge.desc}
                </p>
                </motion.div>
            ))}
            </div>
        </div>
    </section>

  )
}

export default TrustSection