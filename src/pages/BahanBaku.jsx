
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  Info,
} from 'lucide-react'
import BahanBakuModal from '../components/bahan-baku/BahanBakuModal'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 2,
  }).format(value)

function BahanBaku() {
  const [materials, setMaterials] = useState([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [materials, search])

  const handleAdd = () => {
    setEditingMaterial(null)
    setIsModalOpen(true)
  }

  const handleEdit = (material) => {
    setEditingMaterial(material)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData) => {
    const duplicate = materials.some(
      (item) =>
        item.name.toLowerCase() === formData.name.toLowerCase() &&
        item.id !== editingMaterial?.id
    )

    if (duplicate) {
      alert('Nama bahan baku sudah tersedia.')
      return
    }

    if (editingMaterial) {
      setMaterials((prev) =>
        prev.map((item) =>
          item.id === editingMaterial.id
            ? { ...item, ...formData }
            : item
        )
      )
    } else {
      setMaterials((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          ...formData,
          createdAt: new Date().toISOString(),
        },
      ])
    }

    setIsModalOpen(false)
    setEditingMaterial(null)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin menghapus bahan baku ini?'
    )

    if (!confirmed) return

    setMaterials((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-7 text-white shadow-lg shadow-blue-200">
        <div className="absolute -left-10 -bottom-20 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2">
                <Package size={20} />
              </div>
              <span className="text-sm font-bold tracking-wide">
                ABERCIO POS
              </span>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Manajemen Bahan Baku
            </h1>

            <p className="mt-1 text-sm text-blue-50">
              Kelola stok bahan mentah, kemasan, dan harga modal Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50"
          >
            <Plus size={20} />
            Tambah Bahan Baku
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm">
        <div className="relative">
          <Search
            size={21}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama bahan baku (contoh: Tepung, Gula)..."
            className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Material Cards */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-sm transition hover:shadow-md"
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />

              <div className="p-5">
                {/* Name and Perishable Badge */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {item.name}
                  </h2>

                  {item.perishable && (
                    <span className="shrink-0 rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                      Mudah Busuk
                    </span>
                  )}
                </div>

                {/* Information */}
                <div className="space-y-2 rounded-xl border border-blue-100 bg-white/80 p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Satuan:</span>
                    <span className="font-semibold text-slate-900">
                      {item.purchaseQty} {item.unit}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Harga Modal:</span>
                    <span className="text-right font-bold text-blue-600">
                      {formatRupiah(item.unitCost)} / {item.unit}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Masa Simpan:</span>
                    <span className="font-semibold text-slate-900">
                      {item.perishable ? `${item.shelfLife} hari` : '-'}
                    </span>
                  </div>
                </div>

                {/* Stock */}
                <div className="my-4 flex items-center justify-between border-y border-dashed border-blue-200 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Stok Gudang:
                  </span>

                  <span className="rounded-lg border border-blue-200 bg-blue-100 px-3 py-2 font-bold text-blue-700">
                    {item.stock} {item.unit}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-100 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-100 py-3 text-sm font-bold text-red-600 transition hover:bg-red-200"
                  >
                    <Trash2 size={17} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-16 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Package size={28} />
          </div>

          <h3 className="font-semibold text-slate-700">
            {search ? 'Bahan baku tidak ditemukan' : 'Belum ada bahan baku'}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {search
              ? 'Coba gunakan kata pencarian lainnya.'
              : 'Klik tombol Tambah Bahan Baku untuk menambahkan data.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <BahanBakuModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingMaterial(null)
        }}
        onSubmit={handleSubmit}
        editingMaterial={editingMaterial}
      />
    </div>
  )
}

export default BahanBaku
