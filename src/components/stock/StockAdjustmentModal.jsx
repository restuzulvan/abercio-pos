
import { useEffect, useState } from 'react'
import { X, Package } from 'lucide-react'

function StockAdjustmentModal({
  isOpen,
  onClose,
  product,
  type,
  onSubmit,
}) {
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setQuantity('')
      setNote('')
      setError('')
    }
  }, [isOpen, product, type])

  if (!isOpen || !product) return null

  const isIncoming = type === 'in'

  const handleSubmit = (e) => {
    e.preventDefault()

    const amount = Number(quantity)

    if (!Number.isInteger(amount) || amount <= 0) {
      setError('Masukkan jumlah stok berupa bilangan bulat positif.')
      return
    }

    if (!isIncoming && amount > product.stock) {
      setError('Jumlah pengurangan melebihi stok yang tersedia.')
      return
    }

    if (!note.trim()) {
      setError('Keterangan penyesuaian wajib diisi.')
      return
    }

    onSubmit(amount, note.trim())
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-800">
              {isIncoming ? 'Tambah Stok' : 'Kurangi Stok'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {product.name}
            </p>
          </div>

          <button onClick={onClose}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Stok saat ini</p>
              <p className="font-bold text-xl text-slate-800">
                {product.stock} {product.unit}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">
              Jumlah {isIncoming ? 'Penambahan' : 'Pengurangan'}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Masukkan jumlah stok"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">
              Keterangan *
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Contoh: Pembelian barang dari supplier"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 rounded-xl text-sm font-semibold"
            >
              Batal
            </button>

            <button
              type="submit"
              className={`px-5 py-3 text-white rounded-xl text-sm font-semibold ${
                isIncoming ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Simpan Penyesuaian
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default StockAdjustmentModal
