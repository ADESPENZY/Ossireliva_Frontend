import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query" // Added useQuery
import { logout, getMe } from "@/services/apiAuth" // Assuming getMe calls your /me/ endpoint
import { toast } from "sonner"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  CreditCard,
  Settings,
  Loader2, 
} from "lucide-react"

export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // 1. Get the current user's role
  const { data: user, isLoading } = useQuery({ 
    queryKey: ["me"], 
    queryFn: getMe,
    staleTime: 1000 * 60 * 5 
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      navigate("/login", { replace: true })
      toast.success("Logged out")
    },
    onError: () => {
      toast.error("Logout failed")
    },
  })

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  // 2. Define nav items inside or filter them based on role
  const isAdmin = user?.role === "admin"

  const navItems = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
    { label: "Transactions", to: "/admin/transactions", icon: CreditCard },
  ]

  // Add Settings ONLY if the user is the Owner (Admin)
  if (isAdmin) {
    navItems.push({ label: "Agency Settings", to: "/admin/settings", icon: Settings })
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-border bg-background transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          {sidebarOpen && (
            <h1 className="font-heading text-lg tracking-tight uppercase italic">
              Ossireliva <span className="text-brand">Agency</span>
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground/60 hover:text-foreground transition"
          >
            ☰
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition ${
                  isActive
                    ? "bg-brand/15 text-brand"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                       text-foreground/70 hover:bg-foreground/5 hover:text-brand
                       transition disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && (
              <span className="text-sm">
                {logoutMutation.isPending ? "Logging out…" : "Logout"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-background">
          <h2 className="font-heading text-xl">
             {isAdmin ? "Owner Control" : "Staff Portal"}
          </h2>
          {/* User Profile Circle */}
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-foreground/40 uppercase">{user?.username}</span>
             <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-[10px] font-bold text-brand">
                {user?.username?.substring(0, 2).toUpperCase()}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}