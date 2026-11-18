
import { useState } from 'react'
import {
  ChartNoAxesCombined,
  CalendarDays,
  Package,
  Wallet,
  Receipt,
  TrendingUp,
  Boxes,
} from 'lucide-react'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function Laporan() {
  const [type, setType] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Data laporan sementara
  // Nantinya dihubungkan dengan TransactionContext,
  // FinanceContext, ProductContext, dan HPPContext.
  const report = {
    productsSold: 0,
    totalSales: 0,
    operationalExpenses: 0,
    totalCapital: 0,
    totalTransactions: 0,
    availableProducts: 0,
    grossProfit: 0,
    netProfit: 0,
  }

  const statistics = [
    {
      label: 'Produk Terjual',
      value: report.productsSold,
      icon: Package,
      type: 'number',
    },
    {
      label: 'Total Penjualan',
      value: formatRupiah(report.totalSales),
      icon: TrendingUp,
    },
    {
      label: 'Biaya Operasional',
      value: formatRupiah(report.operationalExpenses),
      icon: Wallet,
    },
    {
      label: 'Total Modal (HPP)',
      value: formatRupiah(report.totalCapital),
      icon: Boxes,
    },
    {
      label: 'Total Transaksi',
      value: report.totalTransactions,
      icon: Receipt,
      type: 'number',
    },
    {
      label: 'Produk Tersedia',
      value: report.availableProducts,
      icon: Package,
      type: 'number',
    },
  ]

  const handleFilter = (value) => {
    setType(value)
  }

  return (
    <div className="min-h-screen space-y-5 pb-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 left-20 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-white/20 p-2">
              <ChartNoAxesCombined size={21} />
            </div>

            <span className="text-sm font-bold tracking-wide">
              SUPERPOS
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Laporan Penjualan
          </h1>

          <p className="mt-1 text-sm text-blue-50">
            Pantau performa penjualan, biaya, dan laba pada periode terpilih.
          </p>
        </div>
      </div>

      {/* REPORT CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-100 shadow-sm">

        {/* TOP BORDER */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />

        {/* FILTER SECTION */}
        <div className="flex flex-col gap-5 border-b border-blue-200 p-5 lg:flex-row lg:items-center lg:justify-between">

          {/* FILTER TYPE */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-bold text-blue-800">
              TIPE LAPORAN:
            </span>

            {[
              { label: 'SEMUA', value: 'semua' },
              { label: 'ONLINE', value: 'online' },
              { label: 'OFFLINE', value: 'offline' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleFilter(item.value)}
                className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                  type === item.value
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* DATE FILTER */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-blue-800">
              PERIODE:
            </span>

            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 sm:w-[180px]"
              />
            </div>

            <span className="text-sm font-bold text-blue-800">
              s/d
            </span>

            <div className="relative">
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 sm:w-[180px]"
              />
            </div>
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div className="p-5 sm:p-7">

          {/* STATISTICS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {statistics.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="flex min-h-[102px] flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white px-2 py-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {item.label}
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-gray-900">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>

          {/* DIVIDER */}
          <div className="my-5 border-t border-blue-200" />

          {/* PROFIT CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="relative overflow-hidden rounded-2xl bg-blue-700 p-5 text-center text-white shadow-md">
              <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/10" />

              <p className="relative text-sm font-semibold">
                Laba Kotor
              </p>

              <h2 className="relative mt-2 text-2xl font-extrabold">
                {formatRupiah(report.grossProfit)}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-blue-700 p-5 text-center text-white shadow-md">
              <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/10" />

              <p className="relative text-sm font-semibold">
                Laba Bersih
              </p>

              <h2 className="relative mt-2 text-2xl font-extrabold">
                {formatRupiah(report.netProfit)}
              </h2>
            </div>
          </div>

          {/* EMPTY STATE */}
          <div className="flex min-h-[175px] flex-col items-center justify-center py-10 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              Tidak ada data laporan
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Coba ubah filter tanggal atau channel penjualan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Laporan
