
import { Tags, Package } from 'lucide-react'

function CategoryStats({ totalCategories, totalProducts }) {
  const stats = [
    {
      title: 'Total Kategori',
      value: totalCategories,
      icon: Tags,
      color: 'blue',
      description: 'Kategori terdaftar',
    },
    {
      title: 'Total Produk',
      value: totalProducts,
      icon: Package,
      color: 'green',
      description: 'Produk dalam kategori',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                <p className="text-xs text-slate-400 mt-2">
                  {item.description}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                item.color === 'blue'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600'
              }`}>
                <Icon size={25} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CategoryStats
