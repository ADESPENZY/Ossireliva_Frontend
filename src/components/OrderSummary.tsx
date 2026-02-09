import { AnimatePresence, motion } from "motion/react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useCart } from "../contexts/CartContext"

const money = (n: number) => `$${Number(n).toFixed(2)}`

export const OrderSummary = () => {
  const { items, total } = useCart()
  const shipping = 0
  const grandTotal = total + shipping

  return (
    <aside className="lg:sticky lg:top-28 h-fit lg:col-span-1">
      <div className="p-6 lg:p-8 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl text-white mb-6">Order Summary</h2>

        <div className="divide-y divide-white/10">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.productName}</p>
                <p className="text-brand text-sm truncate">{item.variant}</p>
                <p className="text-white/50 text-sm">Qty {item.quantity}</p>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.p
                  key={`${item.id}-${item.quantity}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-white font-medium whitespace-nowrap"
                >
                  {money(item.price * item.quantity)}
                </motion.p>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5 mt-2 space-y-3">
          <div className="flex justify-between text-white/60">
            <span>Subtotal</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`subtotal-${total}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {money(total)}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex justify-between text-white/60">
            <span>Shipping</span>
            <span className="text-brand">{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>

          <div className="flex justify-between text-white text-lg font-semibold pt-3 border-t border-white/10">
            <span>Total</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`total-${grandTotal}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {money(grandTotal)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </aside>
  )
}
