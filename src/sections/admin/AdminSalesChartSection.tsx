import { getDashboardStats } from "@/services/apiOrder";
import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const AdminSalesChartSection = () => {
  const { data } = useQuery({
    queryKey: ["admin-stats"], // Uses same cache as Stats
    queryFn: getDashboardStats,
  });

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
      <h3 className="text-xl mb-6">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data?.sales_history || []}>
          <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};