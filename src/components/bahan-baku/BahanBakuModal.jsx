
import { useEffect, useState } from 'react'
import { Package, X, Info } from 'lucide-react'

const initialForm = {
  name: '',
  purchaseQty: '1',
  unit: 'kg',
  purchaseTotal: '',
  stock: '',
  perishable: false,
  shelfLife: '',
}

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'ml', label: 'Mililiter (ml)' },
  { value: 'pcs', label: 'Pcs' },
  { value: 'pack', label: 'Pack' },
  { value: 'dus', label: 'Dus' },
]

const parseAmount = (value) => {
  if (typeof value === 'number') return value

  const normalized = String(value).trim().replace(/\./g, '').replace(',', '.')
  return Number(normalized)
}

const formatNumber = (value) => {
  if (!value) return ''
  return new Intl.NumberFormat('id-ID').format(value)
}

function BahanBakuModal({
  isOpen,
  onClose,
  onSubmit,
  editingMaterial,
}) {
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    if (!isOpen) return

    if (editingMaterial) {
      setFormData({
        name: editingMaterial.name,
        purchaseQty: String(editingMaterial.purchaseQty),
        unit: editingMaterial.unit,
        purchaseTotal: formatNumber(editingMaterial.purchaseTotal),
        stock: String(editingMaterial.stock),
        perishable: editingMaterial.perishable,
        shelfLife: editingMaterial.shelfLife
          ? String(editingMaterial.shelfLife)
          : '',
      })
    } else {
      setFormData(initialForm)
    }
  }, [isOpen, editingMaterial])

  if (!isOpen) return null

  const updateField = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const purchaseQty = parseAmount(formData.purchaseQty)
    const purchaseTotal = parseAmount(formData.purchaseTotal)
    const stock = parseAmount(formData.stock)
    const shelfLife = Number(formData.shelfLife)

    if (!formData.name.trim()) {
      alert('Nama bahan baku wajib diisi.')
      return
    }

    if (!Number.isFinite(purchaseQty) || purchaseQty <= 0) {
      alert('Isi beli harus lebih dari 0.')
      return
    }

    if (!Number.isFinite(purchaseTotal) || purchaseTotal <= 0) {
      alert('Harga total pembelian tidak valid.')
      return
    }

    if (!Number.isFinite(stock) || stock < 0) {
      alert('Stok awal gudang tidak valid.')
      return
    }

    if (
      formData.perishable &&
      (!Number.isInteger(shelfLife) || shelfLife <= 0)
    ) {
      alert('Masa simpan harus diisi dengan jumlah hari yang valid.')
      return
    }

    onSubmit({
      name: formData.name.trim(),
      purchaseQty,
      unit: formData.unit,
      purchaseTotal,
      unitCost: purchaseTotal / purchaseQty,
      stock,
      perishable: formData.perishable,
      shelfLife: formData.perishable ? shelfLife : 0,
    })
  }

  const inputClass =
    'w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  const labelClass = 'mb-2 block text-sm font-medium text-slate-700'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-5 text-white">
          <div className="absolute -right-5 -top-10 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <Package size={22} />
            </div>

            <h2 className="text-lg font-bold">
              {editingMaterial
                ? 'Edit Bahan Baku'
                : 'Tambah Bahan Baku Baru'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="relative rounded-lg p-2 transition hover:bg-white/20"
          >
            <X size={23} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-6">

            {/* Nama Bahan Baku */}
            <div>
              <label className={labelClass}>
                Nama Bahan Baku <span className="text-red-500">*</span>
              </label>

              <input
                autoFocus
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={updateField}
                placeholder="Contoh: Tepung Terigu"
                className={inputClass}
              />
            </div>

            {/* Isi Beli dan Satuan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[0.7fr_1.3fr]">
              <div>
                <label className={labelClass}>
                  Isi Beli <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  name="purchaseQty"
                  value={formData.purchaseQty}
                  onChange={updateField}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Satuan Beli <span className="text-red-500">*</span>
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={updateField}
                  className={inputClass}
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Harga Total */}
            <div>
              <label className={labelClass}>
                Harga Total Pembelian (Rp) <span className="text-red-500">*</span>
              </label>

              <input
                required
                type="text"
                inputMode="decimal"
                name="purchaseTotal"
                value={formData.purchaseTotal}
                onChange={updateField}
                placeholder="Contoh: 1.324.566"
                className={inputClass}
              />

              <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
                <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />
                Contoh: isi 1 kg dengan harga Rp15.000 akan dihitung sebagai
                Rp15.000 per kg. Gunakan titik untuk pemisah ribuan dan koma
                untuk desimal.
              </p>
            </div>

            {/* Stok Awal */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <label className="mb-2 block text-sm font-bold text-blue-700">
                Stok Awal Gudang <span className="text-red-500">*</span>
              </label>

              <input
                required
                type="number"
                min="0"
                step="any"
                name="stock"
                value={formData.stock}
                onChange={updateField}
                placeholder="Masukkan jumlah stok"
                className={inputClass}
              />

              <p className="mt-2 text-sm text-blue-600">
                Masukkan stok dalam satuan {formData.unit}.
                Contoh: jika punya 100 {formData.unit}, ketik 100.
              </p>
            </div>

            {/* Perishable */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-200 p-4 transition hover:bg-blue-50">
              <input
                type="checkbox"
                name="perishable"
                checked={formData.perishable}
                onChange={updateField}
                className="h-5 w-5 accent-blue-600"
              />

              <span className="text-sm font-medium text-slate-700">
                Bahan ini mudah busuk/rusak (Perishable)
              </span>
            </label>

            {/* Shelf Life */}
            {formData.perishable && (
              <div>
                <label className={labelClass}>
                  Masa Simpan Ideal (Hari) <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={updateField}
                  placeholder="Contoh: 30"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-blue-100 bg-white p-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              {editingMaterial ? 'Simpan Perubahan' : 'Tambah & Stok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BahanBakuModal
