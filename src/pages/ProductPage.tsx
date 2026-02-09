import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPublicProduct } from "@/services/apiProduct"
import type { ProductVariant } from "@/types/product"

import { ProductHeroSection } from "@/sections/productSection/ProductHeroSection"
import { VariantBenefitsSection } from "@/sections/productSection/VariantBenefitsSection"
import { IngredientsSection } from "@/sections/productSection/IngredientsSection"
import { HowToUseSection } from "@/sections/productSection/HowToUseSection"
import { SafetyCareSection } from "@/sections/productSection/SafetyCareSection"

export const ProductPage = () => {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["public-product"],
    queryFn: getPublicProduct,
  })

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null)

  // ✅ IMPORTANT: set default variant AFTER fetch
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand"></div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        Failed to load product
      </div>
    )
  }

  if (!selectedVariant) return null

  return (
    <div className="min-h-screen bg-black pt-20">
      <ProductHeroSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
      />

      <VariantBenefitsSection variant={selectedVariant} />
      <IngredientsSection />
      <HowToUseSection />
      <SafetyCareSection />
    </div>
  )
}
