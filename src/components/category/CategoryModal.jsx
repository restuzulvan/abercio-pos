
import { useEffect, useState } from 'react'
import { X, Folder, Store } from 'lucide-react'

const STORE_NAME = 'Abercio Frozen Food - Cabang Utama'

function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}) {
  const [formData, setFormData] = useState({
    storeName: STORE_NAME,
    name: '',
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        storeName: editingCategory?.storeName || STORE_NAME,
        name: editingCategory?.name || '',
      })
    }
  }, [isOpen, editingCategory])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.storeName || !formData.name.trim()) {
      return
    }

    onSubmit({
      storeName: formData.storeName,
      name: formData.name.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl">

        {/* Header */}
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-6 text-white">
          <div className="absolute -right-5 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2">
              <Folder size={21} />
            </div>

            <h2 className="text-lg font-bold">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative rounded-lg p-2 text-white transition hover:bg-white/20"
          >
            <X size={23} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 bg-white px-5 py-6">

            {/* Pilih Toko */}
            <div>
              <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
                Pilih Toko
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Store
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-blue-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value={STORE_NAME}>
                    Abercio Frozen Food - Cabang Utama
                  </option>
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Nama Kategori */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama Kategori
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Misal: Nugget & Sosis"
                className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-blue-100 bg-blue-50/70 px-5 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal
