import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, type DashboardStats } from "../../services/apiOrder";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export const AdminStatsSection = () => {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) return <div className="grid md:grid-cols-4 gap-6 animate-pulse">...</div>;

  const statCards = [
    { label: 'Total Revenue', value: `$${data?.revenue.toLocaleString()}`, icon: DollarSign },
    { label: 'Total Orders', value: data?.orders_count, icon: ShoppingCart },
    { label: 'Active Products', value: data?.products_count, icon: Package },
    { label: 'Total Customers', value: data?.customers_count, icon: Users },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <stat.icon className="w-7 h-7 text-brand mb-4" />
          <div className="text-2xl font-semibold">{stat.value}</div>
          <div className="text-white/60 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};