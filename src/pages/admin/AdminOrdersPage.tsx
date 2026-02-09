import { AdminOrdersSection } from '../../sections/admin/AdminOrdersSection';

export const AdminOrdersPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Orders</h2>
        <p className="text-white/60">Recent customer orders</p>
      </div>

      <AdminOrdersSection />
    </div>
  );
};
