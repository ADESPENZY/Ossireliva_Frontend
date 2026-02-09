import { motion } from "motion/react"
import { Check } from "lucide-react"
import type { ProductVariant } from "@/types/product"

interface VariantBenefitsSectionProps {
  variant: ProductVariant
}

export const VariantBenefitsSection = ({
  variant,
}: VariantBenefitsSectionProps) => {
  if (!variant.benefits.length) return null

  return (
    <section className="pb-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-4xl text-white mb-12 text-center">
          Benefits of {variant.name}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variant.benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}  
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4"
            >
              <div className="w-6 h-6 bg-brand/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-brand" />
              </div>

              <p className="text-white/80">
                {benefit.text}   {/* ✅ backend field */}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
