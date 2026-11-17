
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Wallet,
  Trash2,
  X,
  Receipt,
} from 'lucide-react'
import { useFinance } from '../context/FinanceContext'

const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const categories = [
  'Operasional',
  'Listrik dan Air',
  'Transportasi',
  'Perlengkapan',
  'Pembelian Barang',
  'Gaji Karyawan',
  'Lainnya',
]

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

export default function Pengeluaran() {
  const { expenses, addExpense, deleteExpense } = useFinance()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    description: '',
    category: 'Operasional',
    amount: '',
    paymentMethod: 'Tunai',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  })

  const totalExpense = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  const filteredExpenses = useMemo(() => {
    const keyword = search.toLowerCase()

    return expenses.filter((item) =>
      item.description.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    )
  }, [expenses, search])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')

    const result = addExpense({
      ...form,
      date: new Date(`${form.date}T12:00:00`).toISOString(),
    })

    if (!result.success) {
      setMessage(result.message)
      return
    }

    setForm({
      description: '',
      category: 'Operasional',
      amount: '',
      paymentMethod: 'Tunai',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    })

    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus pengeluaran ini?')) {
      deleteExpense(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pengeluaran
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catat dan pantau biaya operasional usaha.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          <Plus size={18} />
          Tambah Pengeluaran
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Total Pengeluaran
            </p>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Wallet size={21} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            {rupiah(totalExpense)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Akumulasi seluruh pengeluaran
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Jumlah Catatan
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt size={21} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            {expenses.length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Catatan pengeluaran tersimpan
          </p>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-slate-800">
              Daftar Pengeluaran
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Riwayat biaya usaha.
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengeluaran..."
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">No.</th>
                <th className="px-5 py-4 font-medium">Keterangan</th>
                <th className="px-5 py-4 font-medium">Kategori</th>
                <th className="px-5 py-4 font-medium">Tanggal</th>
                <th className="px-5 py-4 font-medium">Metode</th>
                <th className="px-5 py-4 font-medium">Nominal</th>
                <th className="px-5 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500">
                    {index + 1}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {item.description}
                    {item.note && (
                      <p className="text-xs text-slate-400 mt-1">
                        {item.note}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.category}
                  </td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.paymentMethod}
                  </td>
                  <td className="px-5 py-4 font-semibold text-red-500 whitespace-nowrap">
                    {rupiah(item.amount)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Hapus pengeluaran"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    Belum ada data pengeluaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tambah pengeluaran */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Tambah Pengeluaran
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Masukkan detail biaya usaha.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
                className="text-slate-400"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Keterangan
                </label>
                <input
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Contoh: Pembayaran listrik"
                  className="w-full mt-2 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Kategori
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Nominal (Rp)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="Contoh: 150000"
                    className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Tanggal
                  </label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Metode Pembayaran
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="w-full mt-2 p-3 border border-slate-200 rounded-xl"
                  >
                    <option>Tunai</option>
                    <option>Transfer</option>
                    <option>QRIS</option>
                    <option>Debit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Catatan (opsional)
                </label>
                <textarea
                  rows="3"
                  value={form.note}
                  onChange={(e) =>
                    setForm({ ...form, note: e.target.value })
                  }
                  placeholder="Tambahkan catatan..."
                  className="w-full mt-2 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              {message && (
                <p className="text-sm text-red-500">{message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Simpan Pengeluaran
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
