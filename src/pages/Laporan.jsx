
import { useState } from 'react'
import { ChartNoAxesCombined } from 'lucide-react'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

function Laporan() {
  const [reportType, setReportType] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Data sementara untuk tampilan laporan
  const report = {
    productsSold: 0,
    totalSales: 0,
    operationalExpenses: 0,
    totalCapital: 0,
    totalTransactions: 0,
    availableProducts: 1,
    grossProfit: 0,
    netProfit: 0,
  }

  const stats = [
    {
      title: 'Produk Terjual',
      value: report.productsSold,
    },
    {
      title: 'Total Penjualan',
      value: formatRupiah(report.totalSales),
    },
    {
      title: 'Biaya Operasional',
      value: formatRupiah(report.operationalExpenses),
    },
    {
      title: 'Total Modal (HPP)',
      value: formatRupiah(report.totalCapital),
    },
    {
      title: 'Total Transaksi',
      value: report.totalTransactions,
    },
    {
      title: 'Produk Tersedia',
      value: report.availableProducts,
    },
  ]

  return (
    <div className="w-full space-y-5 pb-5">

      {/* HEADER */}
      <div className="relative min-h-[153px] overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 text-white shadow-lg shadow-blue-200">

        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600">
              <ChartNoAxesCombined size={18} />
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

      {/* MAIN CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-100 shadow-sm">

        {/* BLUE TOP LINE */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />

        {/* FILTER */}
        <div className="flex flex-col justify-between gap-5 border-b border-blue-200 px-5 py-5 lg:flex-row lg:items-center lg:px-7">

          {/* REPORT TYPE */}
          <div className="flex flex-wrap items-center gap-2.5">
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
                type="button"
                onClick={() => setReportType(item.value)}
                className={`rounded-full border px-5 py-3 text-sm font-bold transition-all ${
                  reportType === item.value
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* DATE RANGE */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="mr-1 text-sm font-bold text-blue-800">
              PERIODE:
            </span>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 sm:w-[180px]"
            />

            <span className="text-sm font-bold text-blue-800">
              s/d
            </span>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 sm:w-[180px]"
            />
          </div>
        </div>

        {/* REPORT BODY */}
        <div className="p-5 sm:px-7 sm:py-5">

          {/* STATISTIC CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {stats.map((item) => (
              <div
                key={item.title}
                className="flex min-h-[101px] flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white px-2 py-4 text-center shadow-sm"
              >
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-xl font-extrabold text-gray-950">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="my-5 border-t border-blue-200" />

          {/* PROFIT */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="relative overflow-hidden rounded-2xl bg-blue-600 px-5 py-5 text-center text-white shadow-md">
              <div className="absolute -right-5 -top-7 h-20 w-20 rounded-full bg-white/10" />

              <p className="relative text-sm font-semibold">
                Laba Kotor
              </p>

              <h2 className="relative mt-2 text-2xl font-extrabold">
                {formatRupiah(report.grossProfit)}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-blue-600 px-5 py-5 text-center text-white shadow-md">
              <div className="absolute -right-5 -top-7 h-20 w-20 rounded-full bg-white/10" />

              <p className="relative text-sm font-semibold">
                Laba Bersih
              </p>

              <h2 className="relative mt-2 text-2xl font-extrabold">
                {formatRupiah(report.netProfit)}
              </h2>
            </div>

          </div>

          {/* EMPTY STATE */}
          <div className="flex min-h-[175px] flex-col items-center justify-center px-4 text-center">

            <h3 className="text-xl font-bold text-gray-900">
              Tidak ada data laporan
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Coba ubah filter tanggal atau channel penjualan.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Laporan
