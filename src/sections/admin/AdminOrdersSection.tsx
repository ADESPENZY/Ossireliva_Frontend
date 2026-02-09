import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAdminOrders, type AdminOrder } from "@/services/apiOrder"
import { Link } from "react-router-dom"
import {
  Search,
  Filter,
  Calendar,
  X,
  RefreshCw,
  ShoppingCart,
  Eye,
} from "lucide-react"

const formatMoney = (amount: any) => {
  const n = Number(amount || 0)
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatDate = (iso?: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const dateKey = (iso?: string) => {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

const statusPill = (status?: string) => {
  const s = String(status || "").toLowerCase()
  if (s === "delivered") return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
  if (s === "shipped" || s === "shipping") return "bg-blue-500/15 text-blue-300 ring-blue-500/30"
  if (s === "processing") return "bg-violet-500/15 text-violet-300 ring-violet-500/30"
  if (s === "pending") return "bg-amber-500/15 text-amber-300 ring-amber-500/30"
  if (s === "cancelled") return "bg-red-500/15 text-red-300 ring-red-500/30"
  if (s === "paid" || s === "success") return "bg-brand/15 text-brand ring-brand/30"
  return "bg-white/10 text-white/70 ring-white/15"
}

export function AdminOrdersSection() {
  const qc = useQueryClient()

  const { data: orders = [], isLoading, isFetching } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  })

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("")

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
  const q = search.toLowerCase().trim()

  // Use the imported AdminOrder type
  return (orders as AdminOrder[]).filter((o) => {
    const status = String(o.status || "")
    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase()

    const matchesDate = !dateFilter || dateKey(o.created_at) === dateFilter

    // Use string fields for search
    const hay = [
      o.order_number,
      o.email,
      o.status,
      // Since first_name might not be in the basic AdminOrder list, 
      // check if they exist or just use order number/email
      o.email
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = !q || hay.includes(q)

    return matchesStatus && matchesDate && matchesSearch
  })
}, [orders, search, statusFilter, dateFilter])

  const stats = useMemo(() => {
    const all = filtered.length
    const pending = filtered.filter(
      (o) => String(o.status).toLowerCase() === "pending"
    ).length
    const paid = filtered.filter(
      (o) => String(o.status).toLowerCase() === "paid"
    ).length
    const shipped = filtered.filter((o) =>
      ["shipped", "shipping"].includes(String(o.status).toLowerCase())
    ).length
    const delivered = filtered.filter(
      (o) => String(o.status).toLowerCase() === "delivered"
    ).length
    return { all, pending, paid, shipped, delivered }
  }, [filtered])

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = filtered.slice(startIndex, endIndex)

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p)
  }

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, dateFilter])

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["admin-orders"] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Orders
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Track order statuses, filter by date, and review customer activity.
          </p>
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold
          bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
        >
          <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/60">Total</p>
            <div className="h-10 w-10 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-brand" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {isLoading ? "—" : stats.all}
          </p>
          <p className="mt-1 text-xs text-white/40">All orders (filtered)</p>
        </div>

        {[
          { label: "Pending", value: stats.pending, hint: "Awaiting confirmation" },
          { label: "Paid", value: stats.paid, hint: "Payment completed" },
          { label: "Shipped", value: stats.shipped, hint: "In transit" },
          { label: "Delivered", value: stats.delivered, hint: "Completed" },
        ].map((x) => (
          <div key={x.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white/60">{x.label}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">
              {isLoading ? "—" : x.value}
            </p>
            <p className="mt-1 text-xs text-white/40">{x.hint}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, order number, email, status…"
              className="w-full h-12 pl-11 pr-4 rounded-xl
              border border-white/10 bg-black/60 text-white placeholder:text-white/40
              focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/70">
              <Filter className="w-4 h-4 text-white/50" />
              Status
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-black/60 px-4
              text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/70">
              <Calendar className="w-4 h-4 text-white/50" />
              Date
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-black/60 px-4
              text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {(search.trim() || statusFilter !== "All" || dateFilter) && (
            <button
              onClick={() => {
                setSearch("")
                setStatusFilter("All")
                setDateFilter("")
              }}
              className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4
              text-sm font-semibold text-white hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-white/60">
          Showing{" "}
          <span className="font-extrabold text-white">{paginated.length}</span>{" "}
          of{" "}
          <span className="font-extrabold text-white">{filtered.length}</span>{" "}
          orders
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Order list</h3>
            <p className="text-sm text-white/60 mt-0.5">
              Amounts shown in your store currency.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-black/40 border-b border-white/10">
              <tr className="text-left">
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Order
                </th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Customer
                </th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Total
                </th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Status
                </th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Date
                </th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-white/40" />
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-white/60">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-extrabold text-white">
                        {order.order_number || order.id}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        ID: {order.id}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">
                        {order.first_name || order.last_name
                          ? `${order.first_name || ""} ${order.last_name || ""}`.trim()
                          : "—"}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {order.email || "—"}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-extrabold text-white">
                        ${formatMoney(order.total)}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-extrabold ring-1 ring-inset ${statusPill(
                          order.status
                        )}`}
                      >
                        {order.status || "—"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-sm text-white/60">
                        {formatDate(order.created_at)}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center rounded-xl
                        border border-white/10 bg-white/5 p-2.5 text-white hover:bg-white/10 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/60">
              Showing {startIndex + 1}–{Math.min(endIndex, filtered.length)} of{" "}
              {filtered.length} orders
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium
                bg-white/5 text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 border rounded-xl text-sm font-medium min-w-[40px] transition ${
                      currentPage === page
                        ? "bg-brand text-brand-foreground border-brand"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium
                bg-white/5 text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
