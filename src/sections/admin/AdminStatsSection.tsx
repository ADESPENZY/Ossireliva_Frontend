import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

const stats = [
  { label: 'Revenue', value: '$38,200', icon: DollarSign },
  { label: 'Orders', value: '847', icon: ShoppingCart },
  { label: 'Products', value: '6', icon: Package },
  { label: 'Customers', value: '1,247', icon: Users },
];

export const AdminStatsSection = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 bg-white/5 border border-white/10 rounded-xl"
        >
          <stat.icon className="w-7 h-7 text-brand mb-4" />
          <div className="text-2xl font-semibold">{stat.value}</div>
          <div className="text-white/60 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
