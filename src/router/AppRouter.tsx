import { Routes, Route, Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/services/apiAuth"
import MainLayout from "../layouts/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { ProductPage } from "@/pages/ProductPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { SuccessPage } from "@/pages/SuccessPage"

import { AdminLayout } from "@/layouts/AdminLayout"
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage"
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage"
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage"
import { AdminOrderDetailPage } from "@/pages/admin/AdminOrderDetailPage"

import LoginPage from "@/pages/LoginPage"
import ProtectedRoute from "./ProtectedRoute"
import { TransactionsPage } from "@/pages/admin/AdminTransactionPage"
import { AdminSettings } from "@/pages/admin/AdminSettings"
import type { JSX } from "react/jsx-runtime"
import ScrollToTop from "@/components/ScrollToTop"

export default function AppRouter() {
  const AdminOnly = ({ children, user, isLoading }: { children: JSX.Element; user: any; isLoading: boolean }) => {
    if (isLoading) return null; // Wait for the check to finish
    if (user?.role !== "admin") return <Navigate to="/admin" replace />;
    return children;
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <Routes>
      <ScrollToTop />
      {/* PUBLIC */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED ADMIN ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route 
            path="settings" 
            element={
              <AdminOnly user={user} isLoading={isLoading}>
                <AdminSettings />
              </AdminOnly>
            } 
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-black flex items-center justify-center text-white">
            404 – Page not found
          </div>
        }
      />
    </Routes>
  )
}
