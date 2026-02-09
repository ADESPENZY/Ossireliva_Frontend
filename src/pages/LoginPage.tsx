import { login } from "@/services/apiAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Lock, User, Eye, EyeOff, Loader2, Shield, Sparkles } from "lucide-react"
import { useState } from "react"

type LoginForm = {
  username: string
  password: string
}

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      toast.success("Welcome back!")
      window.location.href = "/admin";
      // Store user data in localStorage if needed
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
      navigate("/admin", { replace: true })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Invalid credentials"
      toast.error(message)
    },
  })

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 -left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 -right-1/4 w-96 h-96 bg-brand-soft/20 rounded-full blur-3xl"
        />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-soft opacity-20 blur-xl rounded-3xl" />

        {/* Card */}
        <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand/30 blur-xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center shadow-lg shadow-brand/50">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-brand" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-white mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Admin Access
            </h1>
            <p className="text-white/60 text-sm">
              Sign in to manage your e-commerce platform
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Username field */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand transition" />
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none transition"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-1"
                >
                  ⚠️ {errors.username.message}
                </motion.p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand transition" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-black/60 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-brand transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-1"
                >
                  ⚠️ {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-black/60 text-brand focus:ring-brand/30 focus:ring-2"
                />
                <span className="text-white/60 group-hover:text-white transition">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-brand hover:text-brand-soft transition font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-brand to-brand-soft shadow-lg shadow-brand/30 hover:shadow-brand/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign in to Dashboard
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 text-sm">
              Protected by industry-leading security
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-xs text-white/60">Secure Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-brand" />
                <span className="text-xs text-white/60">Encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-brand/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border border-brand-soft/20 rounded-full" />
    </div>
  )
}

export default LoginPage
