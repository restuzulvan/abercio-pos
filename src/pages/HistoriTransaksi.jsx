
import { useMemo, useState } from 'react'
import {
  Search,
  ReceiptText,
  Eye,
  X,
  CalendarDays,
  ShoppingBag,
  Banknote,
} from 'lucide-react'
import { useTransactions } from '../context/TransactionContext'

const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const dateFormat = (date) =>
  new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

export default function HistoriTransaksi() {
  const { transactions } = useTransactions()

  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filter, setFilter] = useState('Semua')

  const today = new Date().toDateString()

  const todayTransactions = transactions.filter(
    (item) => new Date(item.date).toDateString() === today
  )

  const todayRevenue = todayTransactions.reduce(
    (sum, item) => sum + item.total,
    0
  )

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const keyword = search.toLowerCase()

      const matchSearch =
        item.invoice.toLowerCase().includes(keyword) ||
        item.customerName.toLowerCase().includes(keyword)

      const matchFilter =
        filter === 'Semua' ||
        (filter === 'Tunai' && item.paymentMethod === 'Tunai') ||
        (filter === 'Non-Tunai' && item.paymentMethod !== 'Tunai')

      return matchSearch && matchFilter
    })
  }, [transactions, search, filter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Histori Transaksi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau dan periksa seluruh transaksi penjualan.
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Total Transaksi
            </p>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <ReceiptText size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            {transactions.length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Seluruh transaksi tersimpan
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Transaksi Hari Ini
            </p>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            {todayTransactions.length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jumlah transaksi hari ini
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Penjualan Hari Ini
            </p>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Banknote size={20} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-3">
            {rupiah(todayRevenue)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total nilai penjualan hari ini
          </p>
        </div>
      </div>

      {/* Tabel transaksi */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-slate-800">
                Daftar Transaksi
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Riwayat penjualan Abercio Frozen Food.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nomor atau pelanggan..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="Semua">Semua metode</option>
                <option value="Tunai">Tunai</option>
                <option value="Non-Tunai">Non-Tunai</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">No.</th>
                <th className="px-5 py-4 font-medium">Nomor Transaksi</th>
                <th className="px-5 py-4 font-medium">Tanggal</th>
                <th className="px-5 py-4 font-medium">Pelanggan</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Pembayaran</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 font-semibold text-blue-600 whitespace-nowrap">
                    {item.invoice}
                  </td>

                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {dateFormat(item.date)}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.customerName}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                    {rupiah(item.total)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.paymentMethod}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => setSelectedTransaction(item)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Eye size={16} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-14 text-center">
                    <ReceiptText
                      size={38}
                      className="mx-auto text-slate-300"
                    />
                    <p className="text-slate-500 mt-3">
                      Belum ada transaksi ditemukan.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Transaksi yang berhasil akan muncul di sini.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">
          Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
        </div>
      </div>

      {/* Modal detail transaksi */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Detail Transaksi
                </h2>
                <p className="text-sm text-blue-600 mt-1">
                  {selectedTransaction.invoice}
                </p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Tutup detail"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Tanggal</p>
                  <p className="font-medium mt-1">
                    {dateFormat(selectedTransaction.date)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Pelanggan</p>
                  <p className="font-medium mt-1">
                    {selectedTransaction.customerName}
                  </p>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-200 py-4">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Produk Dibeli
                </h3>

                <div className="space-y-3">
                  {selectedTransaction.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {item.quantity} x {rupiah(item.price)}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-800 whitespace-nowrap">
                        {rupiah(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold text-slate-800">
                    {rupiah(selectedTransaction.total)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Metode pembayaran</span>
                  <span>{selectedTransaction.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Uang diterima</span>
                  <span>{rupiah(selectedTransaction.payment)}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Kembalian</span>
                  <span className="font-bold">
                    {rupiah(selectedTransaction.change)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
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
