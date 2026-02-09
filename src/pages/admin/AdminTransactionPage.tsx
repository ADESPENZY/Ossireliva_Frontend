import { useEffect, useMemo, useState } from "react"
import {
  CreditCard,
  Search,
  Download,
  Eye,
  RefreshCw,
  X,
  Package,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/api"
import { Link } from "react-router"

// -----------------------------
// Types
// -----------------------------
type PaymentRow = {
  id: number
  amount: number // cents
  currency: string
  status: string
  stripe_payment_intent_id?: string

  order_number?: string
  order_status?: string
  email?: string
  first_name?: string
  last_name?: string
  created_at?: string

  items?: Array<{
    id: number
    product_name: string
    variant_name: string
    unit_price: string | number
    quantity: number
    total_price: string | number
  }>

  shipping_address?: {
    address: string
    city: string
    state: string
    country: string
    zip_code: string
  }
}

type UITransaction = {
  _id: string
  reference: string
  email: string
  customer_name: string
  amount_cents: number
  currency: string
  status: "success" | "pending" | "failed"
  createdAt?: string
  metadata: {
    items: any[]
    shipping_address: any
    order_number?: string
    order_status?: string
  }
}

// -----------------------------
// Helpers
// -----------------------------
const toUIStatus = (stripeStatus?: string): UITransaction["status"] => {
  const s = String(stripeStatus || "").toLowerCase()

  if (s === "succeeded") return "success"
  if (["failed", "canceled", "cancelled"].includes(s)) return "failed"

  // everything else is "pending"
  return "pending"
}

const formatMoney = (amountCents: number, currency = "usd") => {
  const n = Number(amountCents || 0) / 100
  return `${currency.toUpperCase()} ${n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString()
}

const getStatusBadge = (status: UITransaction["status"]) => {
  const styles: Record<UITransaction["status"], string> = {
    success:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    failed: "bg-red-500/10 text-red-300 border border-red-500/20",
  }

  const label =
    status === "success" ? "Successful" : status === "failed" ? "Failed" : "Pending"

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${styles[status]}`}>
      {label}
    </span>
  )
}

// -----------------------------
// API
// -----------------------------
async function getAdminPayments(): Promise<PaymentRow[]> {
  const { data } = await api.get("/api/payments/admin/payments/")
  return data
}

// -----------------------------
// Component
// -----------------------------
export function TransactionsPage() {
  const qc = useQueryClient()

  const { data: payments = [], isLoading, isFetching } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: getAdminPayments,
  })

  // map backend shape -> your UI shape (so modal stays easy)
  const transactions: UITransaction[] = useMemo(() => {
    return (payments as PaymentRow[]).map((p) => {
      const customer = `${p.first_name || ""} ${p.last_name || ""}`.trim()

      return {
        _id: String(p.id),
        reference: p.stripe_payment_intent_id || p.order_number || `PAY-${p.id}`,
        email: p.email || "—",
        customer_name: customer || "N/A",
        amount_cents: Number(p.amount || 0),
        currency: p.currency || "usd",
        status: toUIStatus(p.status),
        createdAt: p.created_at,
        metadata: {
          items: p.items || [],
          shipping_address: p.shipping_address || null,
          order_number: p.order_number,
          order_status: p.order_status,
        },
      }
    })
  }, [payments])

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | UITransaction["status"]>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<UITransaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()

    return transactions.filter((t) => {
      const matchesSearch =
        !q ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.reference || "").toLowerCase().includes(q) ||
        (t.customer_name || "").toLowerCase().includes(q)

      const matchesStatus = statusFilter === "all" || t.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [transactions, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, itemsPerPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage)
  }

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["admin-payments"] })
  }

  const exportTransactions = () => {
    const csv = [
      ["Reference", "Email", "Customer", "Amount", "Currency", "Status", "Date"].join(","),
      ...filteredTransactions.map((t) =>
        [
          t.reference,
          t.email,
          t.customer_name || "N/A",
          (Number(t.amount_cents || 0) / 100).toFixed(2),
          (t.currency || "usd").toUpperCase(),
          t.status,
          t.createdAt ? new Date(t.createdAt).toISOString() : "",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const viewDetails = (transaction: UITransaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  // Stats
  const totalRevenueCents = useMemo(() => {
    return transactions
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + (t.amount_cents || 0), 0)
  }, [transactions])

  const successfulTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === "success").length
  }, [transactions])

  const pendingTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === "pending").length
  }, [transactions])

  const failedTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === "failed").length
  }, [transactions])

  // Page numbers (nice pagination)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Transactions</h2>
          <p className="text-sm text-white/60 mt-1">
            Monitor Stripe payments, export reports, and inspect order details.
          </p>
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition text-white"
        >
          <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/60">Total Revenue</p>
            <div className="h-10 w-10 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white">
            {formatMoney(totalRevenueCents, "usd")}
          </p>
          <p className="mt-1 text-xs text-white/50">Successful payments only</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-white/60">Successful</p>
          <p className="mt-3 text-2xl font-extrabold text-white">
            {isLoading ? "—" : successfulTransactions}
          </p>
          <p className="mt-1 text-xs text-white/50">Completed payments</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-white/60">Pending</p>
          <p className="mt-3 text-2xl font-extrabold text-white">
            {isLoading ? "—" : pendingTransactions}
          </p>
          <p className="mt-1 text-xs text-white/50">Awaiting confirmation</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-white/60">Failed</p>
          <p className="mt-3 text-2xl font-extrabold text-white">
            {isLoading ? "—" : failedTransactions}
          </p>
          <p className="mt-1 text-xs text-white/50">Failed or canceled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by email, reference, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-white/10 bg-black/40 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="all">All Status</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <button
              onClick={exportTransactions}
              className="h-12 rounded-2xl px-4 text-sm font-semibold text-white bg-gradient-to-r from-brand to-brand-soft shadow-lg shadow-brand/25 hover:scale-[1.01] transition inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={refresh}
              className="h-12 rounded-2xl px-4 text-sm font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/60">
          Showing{" "}
          <span className="font-extrabold text-white">{currentTransactions.length}</span>{" "}
          of{" "}
          <span className="font-extrabold text-white">{filteredTransactions.length}</span>{" "}
          transactions
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left">
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Reference</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Customer</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Email</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Amount</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Status</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Date</th>
                <th className="py-3.5 px-6 text-xs font-extrabold text-white/60">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-white/40" />
                    </div>
                  </td>
                </tr>
              ) : currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/60">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono font-extrabold text-white">
                      {t.reference}
                      <div className="text-xs font-normal text-white/50 mt-1">
                        Order: {t.metadata?.order_number || "—"} • {t.metadata?.order_status || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-white">{t.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{t.email}</td>

                    <td className="px-6 py-4 text-sm font-extrabold text-white">
                      {formatMoney(t.amount_cents, t.currency)}
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(t.status)}</td>

                    <td className="px-6 py-4 text-sm text-white/70">
                      {formatDateTime(t.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewDetails(t)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-white/60">
                Showing{" "}
                <span className="font-extrabold text-white">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-extrabold text-white">
                  {Math.min(endIndex, filteredTransactions.length)}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-white">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-white/60">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? "bg-brand text-black"
                          : "border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 bg-black">
            {/* Header */}
            <div className="p-6 border-b border-white/10 sticky top-0 bg-black rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Transaction Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Reference
                  </p>
                  <p className="text-sm font-mono font-extrabold text-white">
                    {selectedTransaction.reference}
                  </p>
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                    Status
                  </p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Customer
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {selectedTransaction.customer_name}
                  </p>
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm text-white break-all">{selectedTransaction.email}</p>
                </div>

                <div className="rounded-xl p-4 bg-gradient-to-br from-brand/20 to-brand-soft/10 border border-brand/25">
                  <p className="text-xs font-semibold text-white/60 mb-1 uppercase tracking-wide">
                    Amount
                  </p>
                  <p className="text-2xl font-extrabold text-white">
                    {formatMoney(selectedTransaction.amount_cents, selectedTransaction.currency)}
                  </p>
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-sm text-white">{formatDateTime(selectedTransaction.createdAt)}</p>
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Order
                  </p>
                  <p className="text-sm font-mono font-bold text-white">
  {selectedTransaction.metadata?.order_number ? (
    <Link 
      to={`/admin/orders/${selectedTransaction._id}`} // Or however you map the ID
      className="text-brand hover:underline"
    >
      {selectedTransaction.metadata.order_number}
    </Link>
  ) : "—"}
</p>
                  <p className="text-xs text-white/60 mt-1">
                    Status: {selectedTransaction.metadata?.order_status || "—"}
                  </p>
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wide">
                    Currency
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {(selectedTransaction.currency || "usd").toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand" />
                  Order Details
                </h3>

                {/* Items */}
                {selectedTransaction.metadata?.items?.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-white/70 mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {selectedTransaction.metadata.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-xl p-4 bg-white/5 border border-white/10 flex justify-between items-start gap-4"
                        >
                          <div>
                            <p className="font-semibold text-white">
                              {item.product_name}{" "}
                              <span className="text-white/60 font-normal">
                                ({item.variant_name})
                              </span>
                            </p>
                            <p className="text-sm text-white/60 mt-1">
                              Quantity:{" "}
                              <span className="font-semibold text-white">{item.quantity}</span>
                            </p>
                          </div>

                          <p className="font-extrabold text-white">
                            ${Number(item.total_price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No items attached.</p>
                )}

                {/* Shipping Address */}
                {selectedTransaction.metadata?.shipping_address ? (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/50" />
                      Shipping Address
                    </p>

                    <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                      <p className="text-sm text-white">
                        {selectedTransaction.metadata.shipping_address.address}
                      </p>
                      <p className="text-sm text-white/80 mt-1">
                        {selectedTransaction.metadata.shipping_address.city},{" "}
                        {selectedTransaction.metadata.shipping_address.state}
                      </p>
                      <p className="text-sm text-white/80">
                        {selectedTransaction.metadata.shipping_address.zip_code}{" "}
                        {selectedTransaction.metadata.shipping_address.country}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Raw Metadata */}
                <details className="mt-4">
                  <summary className="text-sm font-semibold text-white/70 cursor-pointer hover:text-white flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    View Raw Metadata
                  </summary>
                  <div className="mt-3">
                    <pre className="text-xs bg-black text-emerald-300 p-4 rounded-xl overflow-x-auto font-mono border border-white/10">
                      {JSON.stringify(selectedTransaction.metadata, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand to-brand-soft hover:scale-[1.01] transition shadow-lg shadow-brand/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
