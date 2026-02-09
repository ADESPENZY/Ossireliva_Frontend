import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { toast } from "sonner"

import productImage1 from "../../assets/83a00bb364b2616a6523d5536a850f3da94a4d73.png"
import productImage2 from "../../assets/1bc5f85c823f68013718c4f317566b3c9523b737.png"

import type { Product, ProductVariant } from "@/types/product"

interface ProductHeroSectionProps {
  product: Product
  selectedVariant: ProductVariant
  onVariantChange: (variant: ProductVariant) => void
}

export const ProductHeroSection = ({
  product,              // ✅ FIX: destructure product
  selectedVariant,
  onVariantChange,
  }: ProductHeroSectionProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const images = [productImage1, productImage2]

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variant: selectedVariant.name,
      price: Number(selectedVariant.price),
      quantity: quantity,
      image: images[selectedImage],
    })
    toast.success(`Added ${quantity} × ${selectedVariant.name} to cart`)
  }

  useEffect(() => {
    setQuantity(1)
  }, [selectedVariant])


  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* ===== IMAGE ===== */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-2xl overflow-hidden border border-white/10
                         bg-gradient-to-br from-brand/15 via-brand-soft/10 to-black"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${
                      selectedImage === index
                        ? "border-brand scale-105"
                        : "border-white/10 hover:border-white/30"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ===== INFO ===== */}
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl text-white mb-3">
                {product.name}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="text-4xl font-semibold text-white">
              ${selectedVariant.price}
            </div>

            {/* Variants */}
            <div>
              <label className="block text-white mb-4">Choose a blend</label>
              <div className="grid grid-cols-2 gap-4">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => onVariantChange(variant)}
                    className={`p-4 rounded-lg border-2 text-left transition-all
                      ${
                        selectedVariant.id === variant.id
                          ? "border-brand bg-brand/10"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                  >
                    <div className="text-white font-medium">{variant.name}</div>
                    <div className="text-white/60 text-sm">
                      ${variant.price}
                    </div>
                    <div className="text-brand text-sm mt-2">
                      {variant.stock > 0
                        ? `${variant.stock} in stock`
                        : "Out of stock"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-white/10 text-white"
              >
                −
              </button>

              <span className="text-white font-medium w-8 text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-white/10 text-white"
              >
                +
              </button>
            </div>


            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
              className="w-full py-5 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-brand to-brand-soft
                         hover:scale-[1.02]
                         disabled:opacity-50"
            >
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              Add {quantity > 1 ? `${quantity} items` : "to Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
