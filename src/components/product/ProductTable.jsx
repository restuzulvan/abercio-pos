
import {
  Pencil,
  Trash2,
  Package,
  Infinity,
  Power,
} from 'lucide-react'

const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">

          <thead className="border-b border-blue-200 bg-blue-50 text-blue-800">
            <tr>
              <th className="px-5 py-4 font-bold">PRODUK</th>
              <th className="px-5 py-4 font-bold">KATEGORI</th>
              <th className="px-5 py-4 font-bold">
                HARGA (OFFLINE / ONLINE)
              </th>
              <th className="px-5 py-4 font-bold">STOK</th>
              <th className="px-5 py-4 font-bold">STATUS</th>
              <th className="px-5 py-4 text-center font-bold">AKSI</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-100">
            {products.length > 0 ? (
              products.map((product) => {
                const onlinePrice =
                  product.onlinePrice ?? product.sellingPrice

                const isActive = product.status !== 'Nonaktif'
                const trackStock = product.trackStock !== false

                const lowStock =
                  trackStock &&
                  Number(product.stock) <= Number(product.minStock)

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-blue-50/50"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-500">
                          <Package size={21} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-slate-600">
                      {product.category || '-'}
                    </td>

                    {/* Prices */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs text-slate-500">
                            Offline:
                          </span>
                          <span className="font-bold text-slate-800">
                            {rupiah(product.sellingPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs text-slate-500">
                            Online:
                          </span>
                          <span className="font-semibold text-blue-600">
                            {rupiah(onlinePrice)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      {trackStock ? (
                        <span
                          className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                            Number(product.stock) === 0
                              ? 'bg-red-100 text-red-600'
                              : lowStock
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {product.stock} {product.unit}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600"
                          title="Stok tidak dilacak"
                        >
                          <Infinity size={15} />
                          Unlimited
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          title="Edit produk"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Pencil size={18} />
                        </button>

                        <span
                          title={isActive ? 'Produk aktif' : 'Produk nonaktif'}
                          className={`rounded-lg p-2 ${
                            isActive
                              ? 'text-orange-500'
                              : 'text-slate-400'
                          }`}
                        >
                          <Power size={18} />
                        </span>

                        {!trackStock && (
                          <span
                            title="Stok tidak dilacak"
                            className="rounded-lg p-2 text-blue-600"
                          >
                            <Infinity size={19} />
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(product.id)}
                          title="Hapus produk"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-16 text-center">
                  <Package
                    size={38}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-700">
                    Produk belum tersedia
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Tambahkan produk pertama Abercio Frozen Food.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-blue-100 bg-blue-50/50 px-5 py-3">
        <p className="text-xs text-slate-500">
          Menampilkan <span className="font-bold text-blue-700">
            {products.length}
          </span> produk
        </p>
      </div>
    </div>
  )
}

export default ProductTable
