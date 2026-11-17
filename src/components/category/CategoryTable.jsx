
import { Pencil, Trash2, FolderOpen } from 'lucide-react'

const formatDate = (date) => {
  if (!date) return '-'

  let parsedDate

  // Menangani format tanggal DD/MM/YYYY
  if (typeof date === 'string' && date.includes('/')) {
    const [day, month, year] = date.split('/')
    parsedDate = new Date(Number(year), Number(month) - 1, Number(day))
  } else {
    parsedDate = new Date(date)
  }

  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">

          {/* Table Header */}
          <thead>
            <tr className="border-b border-blue-200 bg-blue-50">
              <th className="px-5 py-3 text-sm font-bold text-blue-700">
                NO
              </th>

              <th className="px-5 py-3 text-sm font-bold text-blue-700">
                NAMA KATEGORI
              </th>

              <th className="px-5 py-3 text-sm font-bold text-blue-700">
                NAMA TOKO
              </th>

              <th className="px-5 py-3 text-sm font-bold text-blue-700">
                TANGGAL
              </th>

              <th className="px-5 py-3 text-center text-sm font-bold text-blue-700">
                AKSI
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b border-slate-100 transition hover:bg-blue-50/40 last:border-b-0"
                >
                  <td className="px-5 py-7 text-sm font-medium text-blue-700">
                    {index + 1}
                  </td>

                  <td className="px-5 py-7 text-sm font-semibold text-slate-900">
                    {category.name}
                  </td>

                  <td className="px-5 py-7">
                    <span className="inline-flex rounded-md border border-blue-200 bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                      {category.storeName || 'Abercio Frozen Food - Cabang Utama'}
                    </span>
                  </td>

                  <td className="px-5 py-7 text-sm text-slate-500">
                    {formatDate(category.createdAt)}
                  </td>

                  <td className="px-5 py-7">
                    <div className="flex items-center justify-center gap-8">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        title="Edit kategori"
                        className="text-blue-600 transition hover:scale-110 hover:text-blue-800"
                      >
                        <Pencil size={19} strokeWidth={2.5} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(category.id)}
                        title="Hapus kategori"
                        className="text-red-600 transition hover:scale-110 hover:text-red-800"
                      >
                        <Trash2 size={19} strokeWidth={2.5} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-blue-50 p-4 text-blue-500">
                      <FolderOpen size={28} />
                    </div>

                    <p className="font-semibold text-slate-700">
                      Belum ada kategori
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Silakan tambahkan kategori produk terlebih dahulu.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default CategoryTable
