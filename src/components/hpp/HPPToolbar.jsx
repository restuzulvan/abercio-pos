
import { Search, Tag } from 'lucide-react'

export default function HPPToolbar({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-bold text-blue-900">
          CARI PRODUK
        </label>

        <div className="flex items-center rounded-xl border border-blue-200 bg-white px-4">
          <Search size={19} className="text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-transparent px-3 py-4 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-blue-900">
          FILTER KATEGORI
        </label>

        <div className="flex items-center rounded-xl border border-blue-200 bg-white px-4">
          <Tag size={19} className="text-blue-600" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent px-3 py-4 outline-none"
          >
            <option value="Semua Kategori">Semua Kategori</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
