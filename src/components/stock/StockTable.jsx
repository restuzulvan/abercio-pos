
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

function StockTable({ products, onAdjust }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Daftar Persediaan</h3>
        <p className="text-sm text-slate-400 mt-1">
          Pantau jumlah persediaan produk.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4">Produk</th>
              <th className="px-5 py-4">Kategori</th>
              <th className="px-5 py-4">Stok Saat Ini</th>
              <th className="px-5 py-4">Stok Minimum</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length > 0 ? products.map((product) => {
              const status = product.stock === 0
                ? 'Habis'
                : product.stock <= product.minStock
                  ? 'Menipis'
                  : 'Normal'

              const statusColor = {
                Habis: 'bg-red-100 text-red-600',
                Menipis: 'bg-orange-100 text-orange-600',
                Normal: 'bg-green-100 text-green-600',
              }

              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {product.sku}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.category}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-800">
                    {product.stock} {product.unit}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.minStock} {product.unit}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor[status]}`}>
                      {status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onAdjust(product, 'in')}
                        title="Tambah stok"
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                      >
                        <ArrowDownToLine size={17} />
                      </button>

                      <button
                        onClick={() => onAdjust(product, 'out')}
                        title="Kurangi stok"
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <ArrowUpFromLine size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan="6" className="py-16 text-center text-slate-400">
                  Belum ada data produk. Tambahkan produk terlebih dahulu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 border-t text-xs text-slate-400">
        Menampilkan {products.length} produk
      </div>
    </div>
  )
}

export default StockTable
