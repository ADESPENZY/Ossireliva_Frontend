import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', sales: 4500 },
  { month: 'Feb', sales: 5200 },
  { month: 'Mar', sales: 6100 },
  { month: 'Apr', sales: 5800 },
  { month: 'May', sales: 7200 },
  { month: 'Jun', sales: 8500 },
];

export const AdminSalesChartSection = () => {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
      <h3 className="text-xl mb-6">Sales Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#ffffff60" />
          <YAxis stroke="#ffffff60" />
          <Tooltip />
          <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
