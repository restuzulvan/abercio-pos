
import { AlertTriangle, Package } from 'lucide-react'

function LowStockProducts({ products = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-primary">Stok Menipis</h2>
          <p className="text-xs text-gray-400 mt-1">
            Produk yang perlu diperhatikan
          </p>
        </div>

        <AlertTriangle size={20} className="text-amber-500" />
      </div>

      {products.length === 0 ? (
        <div className="py-10 text-center">
          <Package size={30} className="text-gray-300 mx-auto mb-2" />

          <p className="text-sm text-gray-500">
            Belum ada data stok produk.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">
                  Minimum stok: {product.minimum}
                </p>
              </div>

              <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                Stok: {product.stock}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default LowStockProducts
