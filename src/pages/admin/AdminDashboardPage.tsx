import { AdminStatsSection } from "../../sections/admin/AdminStatsSection"
import { AdminSalesChartSection } from "../../sections/admin/AdminSalesChartSection"
import { AdminRecentOrdersSection } from "../../sections/admin/AdminRecentOrdersSection"

export const AdminDashboardPage = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">Dashboard</h2>
        <p className="text-white/60">
          Overview of store performance
        </p>
      </div>

      {/* Stats */}
      <AdminStatsSection />

      {/* Main dashboard grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart – takes more space */}
        <div className="lg:col-span-2">
          <AdminSalesChartSection />
        </div>

        {/* Recent orders */}
        <AdminRecentOrdersSection />
      </div>
    </div>
  )
}
