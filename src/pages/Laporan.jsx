
import { useMemo, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  CalendarDays,
} from 'lucide-react'
import { useTransactions } from '../context/TransactionContext'
import { useFinance } from '../context/FinanceContext'

const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const dateKey = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Laporan() {
  const { transactions } = useTransactions()
  const { expenses } = useFinance()

  const [period, setPeriod] = useState('bulan')

  const now = new Date()

  const startDate = useMemo(() => {
    const date = new Date(now)
    date.setHours(0, 0, 0, 0)

    if (period === 'hari') {
      return date
    }

    if (period === 'minggu') {
      date.setDate(date.getDate() - 6)
      return date
    }

    if (period === 'bulan') {
      date.setDate(1)
      return date
    }

    date.setMonth(0, 1)
    return date
  }, [period])

  const isInPeriod = (date) => {
    const value = new Date(date)
    return value >= startDate && value <= now
  }

  const periodTransactions = transactions.filter(
    (item) => isInPeriod(item.date)
  )

  const periodExpenses = expenses.filter(
    (item) => isInPeriod(item.date)
  )

  const revenue = periodTransactions.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  )

  const cost = periodTransactions.reduce(
    (sum, transaction) =>
      sum + transaction.items.reduce(
        (itemSum, item) =>
          itemSum +
          Number(item.costPrice ?? 0) * Number(item.quantity || 0),
        0
      ),
    0
  )

  const expenseTotal = periodExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const grossProfit = revenue - cost
  const netProfit = grossProfit - expenseTotal

  // Ringkasan penjualan per hari
  const dailyData = useMemo(() => {
    const result = []

    const numberOfDays =
      period === 'hari' ? 1 :
      period === 'minggu' ? 7 :
      period === 'bulan' ? now.getDate() : 12

    for (let i = 0; i < numberOfDays; i++) {
      let date

      if (period === 'hari') {
        date = new Date(now)
      } else if (period === 'minggu') {
        date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
      } else if (period === 'bulan') {
        date = new Date(now.getFullYear(), now.getMonth(), i + 1)
      } else {
        date = new Date(now.getFullYear(), i, 1)
      }

      const key = dateKey(date)

      const amount = periodTransactions
        .filter((item) => {
          const transactionDate = new Date(item.date)
          return period === 'tahun'
            ? transactionDate.getFullYear() === now.getFullYear() &&
              transactionDate.getMonth() === date.getMonth()
            : dateKey(item.date) === key
        })
        .reduce((sum, item) => sum + Number(item.total || 0), 0)

      result.push({
        label: period === 'tahun'
          ? date.toLocaleDateString('id-ID', { month: 'short' })
          : date.getDate().toString(),
        amount,
      })
    }

    return result
  }, [period, periodTransactions, startDate])

  const maxRevenue = Math.max(
    ...dailyData.map((item) => item.amount),
    1
  )

  const paymentSummary = periodTransactions.reduce((result, item) => {
    result[item.paymentMethod] =
      (result[item.paymentMethod] || 0) + item.total
    return result
  }, {})

  const expenseCategories = periodExpenses.reduce((result, item) => {
    result[item.category] =
      (result[item.category] || 0) + item.amount
    return result
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Laporan Keuangan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan pemasukan, pengeluaran, dan keuntungan usaha.
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3 bg-white text-sm outline-none focus:border-blue-500"
        >
          <option value="hari">Hari Ini</option>
          <option value="minggu">7 Hari Terakhir</option>
          <option value="bulan">Bulan Ini</option>
          <option value="tahun">Tahun Ini</option>
        </select>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Omzet Penjualan</p>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">
            {rupiah(revenue)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {periodTransactions.length} transaksi
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Modal Barang Terjual</p>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">
            {rupiah(cost)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Harga modal produk yang terjual
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Pengeluaran</p>
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">
            {rupiah(expenseTotal)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {periodExpenses.length} catatan pengeluaran
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Estimasi Laba Bersih</p>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 className={`text-xl font-bold mt-3 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {rupiah(netProfit)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Laba kotor dikurangi pengeluaran
          </p>
        </div>
      </div>

      {/* Grafik penjualan */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <div className="mb-6">
          <h2 className="font-bold text-lg text-slate-800">
            Grafik Penjualan
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pergerakan omzet berdasarkan periode terpilih.
          </p>
        </div>

        <div className="h-64 flex items-end gap-2 sm:gap-3 overflow-x-auto pb-2">
          {dailyData.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex-1 min-w-5 h-full flex flex-col justify-end items-center gap-2"
              title={`${item.label}: ${rupiah(item.amount)}`}
            >
              <div className="w-full h-full flex items-end">
                <div
                  className="w-full rounded-t-md bg-blue-500 hover:bg-blue-600 transition"
                  style={{
                    height: `${item.amount > 0 ? Math.max((item.amount / maxRevenue) * 100, 3) : 0}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-sm bg-blue-500" />
          Omzet penjualan
        </div>
      </div>

      {/* Ringkasan tambahan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h2 className="font-bold text-lg text-slate-800">
            Metode Pembayaran
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan berdasarkan metode pembayaran.
          </p>

          <div className="space-y-4 mt-5">
            {Object.entries(paymentSummary).length === 0 ? (
              <p className="text-sm text-slate-400">
                Belum ada transaksi pada periode ini.
              </p>
            ) : (
              Object.entries(paymentSummary).map(([method, amount]) => (
                <div key={method} className="flex justify-between text-sm">
                  <span className="text-slate-600">{method}</span>
                  <span className="font-semibold text-slate-800">
                    {rupiah(amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h2 className="font-bold text-lg text-slate-800">
            Kategori Pengeluaran
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan biaya berdasarkan kategori.
          </p>

          <div className="space-y-4 mt-5">
            {Object.entries(expenseCategories).length === 0 ? (
              <p className="text-sm text-slate-400">
                Belum ada pengeluaran pada periode ini.
              </p>
            ) : (
              Object.entries(expenseCategories).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-slate-600">{category}</span>
                  <span className="font-semibold text-red-500">
                    {rupiah(amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan laba */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <h2 className="font-bold text-lg text-slate-800">
          Rincian Perhitungan Keuangan
        </h2>

        <div className="space-y-4 mt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Omzet penjualan</span>
            <span className="font-semibold">{rupiah(revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Modal barang terjual</span>
            <span className="text-red-500">- {rupiah(cost)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4">
            <span className="font-semibold text-slate-700">Laba kotor</span>
            <span className="font-semibold">{rupiah(grossProfit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pengeluaran operasional</span>
            <span className="text-red-500">- {rupiah(expenseTotal)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4">
            <span className="font-bold text-slate-800">Estimasi laba bersih</span>
            <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {rupiah(netProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
