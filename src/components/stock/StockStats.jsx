
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  PackageX,
} from 'lucide-react'

function StockStats({ products }) {
  const totalStock = products.reduce(
    (sum, product) => sum + product.stock, 0
  )

  const normal = products.filter(
    (product) => product.stock > product.minStock
  ).length

  const low = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= product.minStock
  ).length

  const empty = products.filter(
    (product) => product.stock === 0
  ).length

  const stats = [
    {
      title: 'Total Stok',
      value: totalStock,
      icon: Boxes,
      color: 'blue',
    },
    {
      title: 'Stok Normal',
      value: normal,
      icon: PackageCheck,
      color: 'green',
    },
    {
      title: 'Stok Menipis',
      value: low,
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      title: 'Stok Habis',
      value: empty,
      icon: PackageX,
      color: 'red',
    },
  ]

  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
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
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold mt-3 text-slate-800">
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

export default StockStats
