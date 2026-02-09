import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md
                       bg-gradient-to-b from-black via-black to-gray-900
                       border-l border-white/10 z-50
                       flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">
                    Your Cart
                  </h2>
                  {itemCount > 0 && (
                    <p className="text-sm text-white/50">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-white/30" />
                  </div>
                  <p className="text-white/70 mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-white/40 text-sm mb-6">
                    Add a blend that supports your daily ritual
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/product");
                    }}
                    className="px-6 py-3 rounded-lg
                               bg-gradient-to-r from-brand to-brand-soft
                               text-white font-medium shadow-lg shadow-brand/30"
                  >
                    Browse Products
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl bg-white/5 border border-white/10 p-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">
                            {item.productName}
                          </h3>
                          <p className="text-brand text-sm">
                            {item.variant}
                          </p>
                          <p className="text-white/60 text-sm mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>

                          <span className="w-8 text-center text-white font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/15"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white text-lg font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-lg
                             bg-gradient-to-r from-brand to-brand-soft
                             text-white font-semibold
                             shadow-xl shadow-brand/30
                             transition-transform hover:scale-[1.02]"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={closeCart}
                  className="w-full py-3 text-white/60 hover:text-white transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
