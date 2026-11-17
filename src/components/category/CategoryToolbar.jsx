
import { Search, Plus } from 'lucide-react'

function CategoryToolbar({
  search,
  setSearch,
  onAdd,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

      <div className="relative w-full sm:max-w-md">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari nama kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
      >
        <Plus size={19} />
        Tambah Kategori
      </button>

    </div>
  )
}

export default CategoryToolbar
