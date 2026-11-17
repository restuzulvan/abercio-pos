
import { Utensils, Pencil, Trash2 } from 'lucide-react'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export default function HPPProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-white to-blue-50 p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-blue-200 bg-blue-100 p-4 text-blue-600">
          <Utensils size={30} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {product.name}
          </h3>

          <p className="text-sm text-slate-600">
            {product.category || 'Tanpa kategori'}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            HPP
          </span>

          <p className="mt-2 font-semibold text-slate-800">
            HPP: {formatRupiah(product.hppPerUnit)} / {product.unit}
          </p>

          <p className="mt-1 font-bold text-emerald-700">
            Harga rekomendasi: {formatRupiah(product.recommendationPrice)} / {product.unit}
          </p>
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          <Pencil size={16} />
          EDIT
        </button>

        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
        >
          <Trash2 size={16} />
          HAPUS
        </button>
      </div>
    </div>
  )
}
