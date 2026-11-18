
import { useMemo, useState } from 'react'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Search,
  ShoppingBag,
  CalendarDays,
  X,
  Eye,
} from 'lucide-react'

import { useTransactions } from '../context/TransactionContext'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const getTransactionDate = (transaction) => {
  const value =
    transaction.createdAt ||
    transaction.date ||
    transaction.transactionDate ||
    transaction.tanggal

  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const getTransactionItems = (transaction) => {
  return transaction.cart || transaction.items || transaction.products || []
}

const getTransactionTotal = (transaction) => {
  return Number(
    transaction.total ??
    transaction.grandTotal ??
    transaction.totalPrice ??
    0
  )
}

const getTransactionMode = (transaction) => {
  const mode = String(
    transaction.mode ||
    transaction.type ||
    transaction.transactionType ||
    'offline'
  ).toLowerCase()

  return mode.includes('online') ? 'online' : 'offline'
}

function HistoriTransaksi() {
  const { transactions = [] } = useTransactions()

  const now = new Date()

  // Default menampilkan tiga bulan terakhir
  const [periodOffset, setPeriodOffset] = useState(0)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 2 + periodOffset * 3,
    1
  )

  const periodMonths = Array.from({ length: 3 }, (_, index) =>
    new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + index,
      1
    )
  )

  const firstMonth = periodMonths[0]
  const lastMonth = periodMonths[2]

  const periodLabel =
    `${monthNames[firstMonth.getMonth()]} - ` +
    `${monthNames[lastMonth.getMonth()]} ` +
    `${lastMonth.getFullYear()}`

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const date = getTransactionDate(transaction)

        if (!date) return false

        const startDate = new Date(
          firstMonth.getFullYear(),
          firstMonth.getMonth(),
          1
        )

        const endDate = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          1
        )

        const matchPeriod =
          date >= startDate && date < endDate

        const transactionMode = getTransactionMode(transaction)

        const matchFilter =
          filter === 'all' || transactionMode === filter

        const keyword = search.toLowerCase()

        const customerName = String(
          transaction.customerName || 'Pelanggan Umum'
        ).toLowerCase()

        const transactionId = String(
          transaction.id || transaction.invoice || ''
        ).toLowerCase()

        const matchSearch =
          customerName.includes(keyword) ||
          transactionId.includes(keyword)

        return matchPeriod && matchFilter && matchSearch
      })
      .sort((a, b) => {
        return (
          getTransactionDate(b) - getTransactionDate(a)
        )
      })
  }, [
    transactions,
    firstMonth,
    lastMonth,
    filter,
    search,
  ])

  const isCurrentPeriod = periodOffset === 0

  const formatDate = (dateValue) => {
    const date = getTransactionDate({
      createdAt: dateValue,
    })

    if (!date) return '-'

    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handlePeriodChange = (direction) => {
    setPeriodOffset((current) => current + direction)
  }

  const getTransactionId = (transaction) => {
    return (
      transaction.invoice ||
      transaction.id ||
      'TRX'
    )
  }

  return (
    <div className="min-h-screen space-y-5 pb-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white shadow-lg">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 left-20 h-28 w-28 rounded-full bg-white/5" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <Clock size={21} />
            </div>

            <span className="text-sm font-bold tracking-wide">
              ABERCIO POS
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Riwayat Transaksi
          </h1>

          <p className="mt-1 text-sm text-blue-50">
            Lihat semua transaksi yang telah tercatat di toko Anda.
          </p>
        </div>
      </div>

      {/* HISTORY CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-100 shadow-sm">

        {/* TOP BORDER */}
        <div className="h-1.5 bg-blue-600" />

        {/* FILTER */}
        <div className="flex flex-wrap items-center gap-3 border-b border-blue-100 px-5 py-4">
          <span className="mr-1 text-sm font-bold text-blue-700">
            FILTER:
          </span>

          <button
            onClick={() =>
              setFilter(filter === 'online' ? 'all' : 'online')
            }
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              filter === 'online'
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            ONLINE
          </button>

          <button
            onClick={() =>
              setFilter(filter === 'offline' ? 'all' : 'offline')
            }
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              filter === 'offline'
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            OFFLINE
          </button>
        </div>

        {/* PERIOD NAVIGATION */}
        <div className="flex items-center justify-between gap-3 border-b border-blue-200 px-5 py-4">

          <button
            onClick={() => handlePeriodChange(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200"
            title="Periode sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="min-w-0 rounded-xl border border-blue-200 bg-white px-5 py-2 text-center shadow-sm">
            <p className="text-xs font-bold text-blue-600">
              PERIODE
            </p>

            <p className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
              {periodLabel}
            </p>
          </div>

          <button
            onClick={() => handlePeriodChange(1)}
            disabled={isCurrentPeriod}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-blue-400 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-gray-300"
            title="Periode berikutnya"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="border-b border-blue-100 p-4">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pelanggan atau nomor transaksi..."
              className="h-11 w-full rounded-xl border border-blue-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* TRANSACTION LIST */}
        <div className="min-h-[400px] p-5">

          {filteredTransactions.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Receipt size={38} className="text-blue-400" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Tidak ada riwayat transaksi
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                pada periode yang dipilih.
              </p>

              {(filter !== 'all' || search) && (
                <button
                  onClick={() => {
                    setFilter('all')
                    setSearch('')
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan{' '}
                  <span className="font-bold text-blue-600">
                    {filteredTransactions.length}
                  </span>{' '}
                  transaksi
                </p>

                <span className="text-xs text-gray-400">
                  Terbaru
                </span>
              </div>

              {filteredTransactions.map((transaction, index) => {
                const items = getTransactionItems(transaction)
                const transactionMode = getTransactionMode(transaction)
                const total = getTransactionTotal(transaction)

                const itemCount = items.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity || 1),
                  0
                )

                return (
                  <div
                    key={transaction.id || transaction.invoice || index}
                    className="flex flex-col gap-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <ShoppingBag size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {transaction.customerName || 'Pelanggan Umum'}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {getTransactionId(transaction)}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              transactionMode === 'online'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {transactionMode.toUpperCase()}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDate(
                              transaction.createdAt ||
                              transaction.date ||
                              transaction.transactionDate ||
                              transaction.tanggal
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400">
                          {itemCount} item
                        </p>

                        <p className="mt-1 text-base font-bold text-blue-700">
                          {formatRupiah(total)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <Eye size={16} />
                        Detail
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Detail Transaksi
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {getTransactionId(selectedTransaction)}
                </p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-gray-500">
                    Pelanggan
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {selectedTransaction.customerName || 'Pelanggan Umum'}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-gray-500">
                    Tanggal
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {formatDate(
                      selectedTransaction.createdAt ||
                      selectedTransaction.date ||
                      selectedTransaction.transactionDate ||
                      selectedTransaction.tanggal
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-gray-800">
                  Produk Dibeli
                </h3>

                <div className="space-y-3">
                  {getTransactionItems(selectedTransaction).map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.name || item.productName || 'Produk'}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.quantity || 1} x {formatRupiah(item.price)}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-gray-800">
                        {formatRupiah(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-blue-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">
                    {formatRupiah(selectedTransaction.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Diskon</span>
                  <span className="font-semibold text-green-600">
                    -{formatRupiah(selectedTransaction.discount)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-blue-200 pt-3">
                  <span className="font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-lg font-extrabold text-blue-600">
                    {formatRupiah(getTransactionTotal(selectedTransaction))}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Metode Pembayaran</span>
                  <span className="font-semibold">
                    {selectedTransaction.paymentMethod || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-5">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoriTransaksi
