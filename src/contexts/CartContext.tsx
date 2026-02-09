import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export interface CartItem {
  id: string
  productId: number
  productName: string

  variantId: number // ✅ IMPORTANT for checkout
  variant: string

  price: number // ✅ always number
  quantity: number
  image: string
}

type AddToCartInput = Omit<CartItem, "id">

interface CartContextType {
  items: CartItem[]
  addToCart: (item: AddToCartInput) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (item: AddToCartInput) => {
    const normalizedPrice = Number(item.price) // ✅ guarantee number

    const existing = items.find(
      (i) => i.variantId === item.variantId // ✅ same variant => same line item
    )

    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      )
    } else {
      const newItem: CartItem = {
        ...item,
        price: normalizedPrice,
        id: `${item.variantId}-${Date.now()}`,
      }
      setItems((prev) => [...prev, newItem])
    }

    setIsOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { total, itemCount }
  }, [items])

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total: totals.total,
        itemCount: totals.itemCount,
        isOpen,
        openCart, // ✅ YOU MISSED THIS BEFORE
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
