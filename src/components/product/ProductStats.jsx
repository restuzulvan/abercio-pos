
import { Package, AlertTriangle, Wallet, TrendingUp } from 'lucide-react'

function ProductStats({ products }) {
  const totalProducts = products.length
  const totalStock = products.reduce(
    (sum, item) => sum + item.stock, 0
  )
  const lowStock = products.filter(
    (item) => item.stock > 0 && item.stock <= item.minStock
  ).length
  const outOfStock = products.filter(
    (item) => item.stock === 0
  ).length

  const stats = [
    {
      title: 'Total Produk',
      value: totalProducts,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Total Stok',
      value: totalStock,
      icon: Wallet,
      color: 'indigo',
    },
    {
      title: 'Stok Menipis',
      value: lowStock,
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      title: 'Stok Habis',
      value: outOfStock,
      icon: TrendingUp,
      color: 'red',
    },
  ]

  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.title}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-800 mt-3">
                  {item.value}
                </h3>
              </div>

              <div className={`p-4 rounded-xl ${colors[item.color]}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductStats
