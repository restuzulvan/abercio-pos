
import { Search, Filter, Globe } from 'lucide-react'

function ProductToolbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  channel,
  setChannel,
  status,
  setStatus,
}) {
  const inputStyle =
    'h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">

      {/* Pencarian */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
        />

        <input
          type="text"
          placeholder="Cari nama atau SKU produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputStyle} pl-11`}
        />
      </div>

      {/* Filter Kategori */}
      <div className="relative">
        <Filter
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputStyle} appearance-none pl-10 pr-8`}
        >
          <option value="Semua">Semua Kategori</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Channel */}
      <div className="relative">
        <Globe
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
        />

        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className={`${inputStyle} appearance-none pl-10 pr-8`}
        >
          <option value="Semua">Semua Channel</option>
          <option value="Offline">Offline</option>
          <option value="Online">Online</option>
        </select>
      </div>

      {/* Filter Status */}
      <div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputStyle}
        >
          <option value="Semua">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
      </div>

    </div>
  )
}

export default ProductToolbar
