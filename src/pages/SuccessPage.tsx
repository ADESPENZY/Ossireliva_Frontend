import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { getPaymentStatus } from "@/services/apiPayment";
import {
  CheckCircle,
  Package,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

export const SuccessPage = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  // const navigate = useNavigate();
  const pi = params.get("pi");

  // Get order number from navigation state (passed from Checkout) or default to placeholder
  const [orderNumber, setOrderNumber] = useState(location.state?.orderNumber || "OSR-XXXXXXX");
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pi) {
      setLoading(false);
      return;
    }

    // Polling function to check if the webhook has updated the backend yet
    const checkStatus = async () => {
      try {
        const res = await getPaymentStatus(pi);
        setOrderNumber(res.order_number);
        setStatus(res.payment_status);

        // If backend says succeeded, we stop loading
        if (res.payment_status === "succeeded" || res.payment_status === "paid") {
          setLoading(false);
          return true; // Stop interval
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
      return false;
    };

    // Initial check
    checkStatus();

    // Set up interval to check every 2 seconds
    const interval = setInterval(async () => {
      const isDone = await checkStatus();
      if (isDone) clearInterval(interval);
    }, 2000);

    // Timeout: Stop loading after 10 seconds even if webhook is slow
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pi]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-24 flex items-center justify-center selection:bg-brand/30">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-10"
        >
          {/* Success Icon */}
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-full bg-brand/20 flex items-center justify-center relative z-10"
            >
              <CheckCircle className="w-14 h-14 text-brand" />
            </motion.div>
            {/* Animated Ring Decor */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-2 border-brand/30" 
            />
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-heading text-4xl md:text-5xl text-white font-bold tracking-tight">
              Order confirmed
            </h1>
            <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
              Your wellness journey has officially begun. Thank you for choosing Ossireliva.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/20 to-brand-soft/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative p-8 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl">
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">
                Order reference
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-brand font-mono text-2xl md:text-3xl tracking-wider font-bold">
                  {orderNumber}
                </p>
                {loading && <Loader2 className="w-5 h-5 text-brand/50 animate-spin" />}
              </div>
              
              {/* Status Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className={`w-2 h-2 rounded-full ${status === 'succeeded' || status === 'paid' ? 'bg-brand' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">
                  {status === 'succeeded' || status === 'paid' ? 'Payment Verified' : 'Verifying Payment...'}
                </span>
              </div>
            </div>
          </div>

          {/* Infographic Steps */}
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-brand" />
              </div>
              <p className="text-white font-semibold mb-2">Confirmation email</p>
              <p className="text-white/50 text-sm leading-relaxed">
                Check your inbox for a detailed receipt and order summary.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-brand" />
              </div>
              <p className="text-white font-semibold mb-2">Fast Shipping</p>
              <p className="text-white/50 text-sm leading-relaxed">
                We'll notify you with a tracking link as soon as your package leaves.
              </p>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="pt-6 space-y-6">
            <Link
              to="/product"
              className="group relative inline-flex items-center justify-center gap-2
                         px-10 py-4 rounded-xl font-bold text-white
                         bg-gradient-to-r from-brand to-brand-soft
                         hover:shadow-[0_0_30px_-5px_rgba(var(--brand-rgb),0.5)]
                         transition-all duration-300"
            >
              Continue shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex flex-col items-center gap-2">
              <p className="text-white/40 text-sm">
                Need help? Contact our support team
              </p>
              <a 
                href="mailto:info@ossireliva.com" 
                className="text-brand hover:text-brand-soft transition-colors font-medium underline underline-offset-4"
              >
                info@ossireliva.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};