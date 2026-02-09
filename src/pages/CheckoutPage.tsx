import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { useCart } from "../contexts/CartContext"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, CreditCard, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { OrderSummary } from "@/components/OrderSummary"

import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { createPaymentCheckout, getPaymentStatus } from "@/services/apiPayment"

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-black/60 border border-white/10 text-white placeholder-white/40 focus:border-brand focus:ring-1 focus:ring-brand/40 focus:outline-none transition"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function PayNow({
  orderNumber,
  onPaid,
}: {
  orderNumber: string
  onPaid: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)

  const confirm = async () => {
    if (!stripe || !elements) return;
    setPaying(true);

    try {
        // 1. Validate the form elements
        const { error: submitError } = await elements.submit();
        if (submitError) {
            toast.error(submitError.message || "Validation failed");
            setPaying(false);
            return;
        }

        // 2. Attempt the payment
        const res = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        // 3. Handle Stripe-specific errors (Declines, etc.)
        if (res.error) {
            setPaying(false);
            const msg = res.error.message || "Your card was declined.";
            toast.error(msg);
            return; // 🛑 Stop here!
        } 
        
        // 4. Handle Success
        if (res.paymentIntent && res.paymentIntent.status === "succeeded") {
            toast.success("Payment confirmed!");
            onPaid();
            return; // ✅ Stop here!
        }

        // 5. Handle other statuses (like processing)
        if (res.paymentIntent && res.paymentIntent.status === "processing") {
            toast.info("Your payment is processing.");
            setPaying(false);
        }

    } catch (err: any) {
        // 6. Handle unexpected code crashes or network errors
        console.error("Payment error:", err);
        
        // Fix for the [object Object] issue:
        const errorMessage = typeof err === 'string' 
            ? err 
            : err.message || "An unexpected error occurred.";
            
        toast.error(errorMessage);
        setPaying(false);
    }
};
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-black/60 border border-white/10 p-4">
        <PaymentElement />
      </div>

      <div className="flex items-center gap-2 text-sm text-white/50">
        <Lock className="w-4 h-4" />
        Secure payment powered by Stripe • Order {orderNumber}
      </div>

      <button
        type="button"
        onClick={confirm}
        disabled={!stripe || !elements || paying}
        className="w-full py-5 rounded-lg font-semibold text-lg text-white bg-gradient-to-r from-brand to-brand-soft shadow-xl shadow-brand/30 hover:scale-[1.02] transition disabled:opacity-50"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Paying…
          </span>
        ) : (
          "Pay now"
        )}
      </button>
    </div>
  )
}

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [_paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>()

  // 🔥 Check for existing pending payment on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("pendingCheckout")
    if (savedSession) {
      try {
        const { clientSecret: saved_cs, orderNumber: saved_on, paymentIntentId: saved_pi, timestamp } = JSON.parse(savedSession)
        
        // Check if session is less than 24 hours old
        const isRecent = Date.now() - timestamp < 24 * 60 * 60 * 1000
        
        if (saved_cs && saved_on && saved_pi && isRecent) {
          // Verify payment status before resuming
          getPaymentStatus(saved_pi).then((statusData) => {
            if (statusData.payment_status === "succeeded") {
              // Payment already completed
              localStorage.removeItem("pendingCheckout")
              navigate("/success", { state: { orderNumber: saved_on } })
            } else if (statusData.payment_status !== "failed" && statusData.payment_status !== "canceled") {
              // Resume the session
              setClientSecret(saved_cs)
              setOrderNumber(saved_on)
              setPaymentIntentId(saved_pi)
              toast.info("Resuming your previous checkout session")
            } else {
              // Clear failed/canceled session
              localStorage.removeItem("pendingCheckout")
            }
          }).catch(() => {
            // If status check fails, clear the session
            localStorage.removeItem("pendingCheckout")
          })
        } else {
          localStorage.removeItem("pendingCheckout")
        }
      } catch {
        localStorage.removeItem("pendingCheckout")
      }
    }
  }, [navigate])

  const onSubmit = async (formData: CheckoutForm) => {
    try {
      setIsProcessing(true)

      const payload = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.zipCode,
        items: items.map((item) => ({
          variant: item.variantId,
          quantity: item.quantity,
        })),
      }

      const res = await createPaymentCheckout(payload)

      // 🔥 Save session to localStorage for recovery
      const checkoutSession = {
        clientSecret: res.client_secret,
        orderNumber: res.order_number,
        paymentIntentId: res.payment_intent_id || res.client_secret.split("_secret_")[0],
        timestamp: Date.now()
      }
      localStorage.setItem("pendingCheckout", JSON.stringify(checkoutSession))

      setClientSecret(res.client_secret)
      setOrderNumber(res.order_number)
      setPaymentIntentId(checkoutSession.paymentIntentId)
      toast.success("Almost done — complete payment below.")
    } catch (err: any) {
      const data = err?.response?.data
      const msg =
        typeof data === "string"
          ? data
          : data?.detail
          ? data.detail
          : data
          ? JSON.stringify(data)
          : "Checkout failed. Please try again."
      toast.error(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuccessfulPayment = () => {
    // Clear the pending checkout session
    localStorage.removeItem("pendingCheckout")
    clearCart()
    navigate("/success", { state: { orderNumber } })
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl text-white mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/product")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-brand to-brand-soft text-white font-medium shadow-lg shadow-brand/30"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 lg:pt-24 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl text-white mb-12"
        >
          Checkout
        </motion.h1>

        {clientSecret && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">Payment session active</p>
              <p className="text-blue-200/80">Complete your payment below. If you leave this page, you can return to finish later.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            {!clientSecret ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Contact */}
                <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl text-white mb-6">Contact Information</h2>

                  <label className="block text-white/60 mb-2">Email address</label>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </section>

                {/* Shipping */}
                <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl text-white mb-6">Shipping Address</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-2">First name</label>
                      <input {...register("firstName", { required: true })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-2">Last name</label>
                      <input {...register("lastName", { required: true })} className={inputClass} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/60 mb-2">Address</label>
                      <input {...register("address", { required: true })} className={inputClass} />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-2">City</label>
                      <input {...register("city", { required: true })} className={inputClass} />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-2">State</label>
                      <input {...register("state", { required: true })} className={inputClass} />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-2">Zip code</label>
                      <input {...register("zipCode", { required: true })} className={inputClass} />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-2">Country</label>
                      <input {...register("country", { required: true })} className={inputClass} />
                    </div>
                  </div>
                </section>

                {/* Payment Button */}
                <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <h2 className="text-xl text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand" />
                    Payment
                  </h2>

                  <p className="text-white/60 mb-6">
                    Click "Continue to Payment" to load the secure Stripe payment form.
                  </p>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-5 rounded-lg font-semibold text-lg text-white bg-gradient-to-r from-brand to-brand-soft shadow-xl shadow-brand/30 hover:scale-[1.02] transition disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing…
                      </span>
                    ) : (
                      `Continue to Payment ($${total.toFixed(2)})`
                    )}
                  </button>
                </section>
              </form>
            ) : (
              <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-xl text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand" />
                  Complete Payment
                </h2>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "night" },
                  }}
                >
                  <PayNow
                    orderNumber={orderNumber || "—"}
                    onPaid={handleSuccessfulPayment}
                  />
                </Elements>
              </section>
            )}
          </div>

          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
