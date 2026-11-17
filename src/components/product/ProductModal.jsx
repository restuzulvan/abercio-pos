
import { useEffect, useState } from 'react'
import { X, Package, CheckCircle2 } from 'lucide-react'

const initialForm = {
  store: 'Abercio Frozen Food - Cabang Utama',
  name: '',
  sku: '',
  category: '',
  unit: 'pack',
  discount: '0',
  costPrice: '',
  sellingPrice: '',
  onlinePrice: '',
  offlineEnabled: true,
  onlineEnabled: false,
  stock: '0',
  minStock: '5',
  trackStock: true,
  status: 'Aktif',
}

const categories = [
  'Sosis',
  'Nugget',
  'Kentang Frozen',
  'Seafood',
  'Daging Olahan',
  'Dimsum',
  'Lain-lain',
]

const stores = [
  'Abercio Frozen Food - Cabang Utama',
]

const inputClass =
  'w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const labelClass =
  'mb-2 block text-sm font-medium text-slate-700'

function SectionTitle({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="h-5 w-1 rounded-full bg-blue-500" />
      <h3 className="text-sm font-bold uppercase tracking-wide text-blue-800">
        {children}
      </h3>
    </div>
  )
}

function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
}) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return

    if (editingProduct) {
      setForm({
        ...initialForm,
        ...editingProduct,
        store: editingProduct.store || initialForm.store,
        discount: String(editingProduct.discount ?? 0),
        costPrice: String(editingProduct.costPrice ?? ''),
        sellingPrice: String(editingProduct.sellingPrice ?? ''),
        onlinePrice: String(editingProduct.onlinePrice ?? ''),
        stock: String(editingProduct.stock ?? 0),
        minStock: String(editingProduct.minStock ?? 5),
        offlineEnabled: editingProduct.offlineEnabled !== false,
        onlineEnabled: editingProduct.onlineEnabled === true,
        trackStock: editingProduct.trackStock !== false,
        status: editingProduct.status || 'Aktif',
      })
    } else {
      setForm(initialForm)
    }

    setError('')
  }, [isOpen, editingProduct])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (
      !form.store ||
      !form.name.trim() ||
      !form.sku.trim() ||
      !form.category ||
      form.costPrice === '' ||
      form.sellingPrice === '' ||
      form.stock === '' ||
      form.minStock === ''
    ) {
      setError('Mohon lengkapi semua data wajib.')
      return
    }

    const cost = Number(form.costPrice)
    const selling = Number(form.sellingPrice)
    const online =
      form.onlinePrice === ''
        ? selling
        : Number(form.onlinePrice)

    const stock = Number(form.stock)
    const minimum = Number(form.minStock)
    const discount = Number(form.discount)

    if (
      !Number.isFinite(cost) ||
      !Number.isFinite(selling) ||
      !Number.isFinite(online) ||
      !Number.isInteger(stock) ||
      !Number.isInteger(minimum) ||
      !Number.isFinite(discount) ||
      cost < 0 ||
      selling < 0 ||
      online < 0 ||
      stock < 0 ||
      minimum < 0 ||
      discount < 0 ||
      discount > 100
    ) {
      setError('Periksa kembali harga, diskon, dan jumlah stok.')
      return
    }

    if (selling < cost || online < cost) {
      setError('Harga jual tidak boleh lebih kecil dari harga modal.')
      return
    }

    if (!form.offlineEnabled && !form.onlineEnabled) {
      setError('Pilih minimal satu channel penjualan.')
      return
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      costPrice: cost,
      sellingPrice: selling,
      onlinePrice: online,
      stock,
      minStock: minimum,
      discount,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">

        {/* HEADER */}
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-5 text-white">
          <div className="absolute -right-5 -top-10 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-xs text-blue-100">
                Lengkapi informasi produk Abercio Frozen Food
              </p>
            </div>
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

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-5">

            {/* INFO DASAR */}
            <section>
              <SectionTitle>Info Dasar</SectionTitle>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Toko <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="store"
                    value={form.store}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {stores.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Kategori <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">-- Pilih Kategori --</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Nama Produk <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Misal: Nugget Ayam Original 500gr"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    SKU / Kode Barang <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="Misal: SKU-6921"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Satuan Jual</label>

                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="pcs">Pcs</option>
                    <option value="pack">Pack</option>
                    <option value="kg">Kg</option>
                    <option value="dus">Dus</option>
                    <option value="ikat">Ikat</option>
                  </select>
                </div>
              </div>
            </section>

            {/* CHANNEL PENJUALAN */}
            <section>
              <SectionTitle>Channel Penjualan</SectionTitle>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                  <input
                    type="checkbox"
                    name="offlineEnabled"
                    checked={form.offlineEnabled}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Penjualan Offline
                    </p>
                    <p className="text-xs text-slate-500">
                      Penjualan melalui kasir
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                  <input
                    type="checkbox"
                    name="onlineEnabled"
                    checked={form.onlineEnabled}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Penjualan Online
                    </p>
                    <p className="text-xs text-slate-500">
                      Penjualan melalui channel online
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* DISKON */}
            <section>
              <SectionTitle>Diskon Produk</SectionTitle>

              <div className="max-w-[400px]">
                <div className="relative">
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.discount}
                    onChange={handleChange}
                    className={`${inputClass} pr-12`}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-500">
                    %
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Nilai diskon disimpan sebagai persentase. Penerapannya
                  pada transaksi Kasir akan kita hubungkan berikutnya.
                </p>
              </div>
            </section>

            {/* STOK */}
            <section>
              <SectionTitle>Stok & Penjualan</SectionTitle>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Stok Awal <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Stok Minimum
                  </label>

                  <input
                    type="number"
                    name="minStock"
                    min="0"
                    step="1"
                    value={form.minStock}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                <input
                  type="checkbox"
                  name="trackStock"
                  checked={form.trackStock}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 accent-blue-600"
                />

                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Stok dilacak otomatis
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Hilangkan centang jika stok tidak perlu dilacak.
                    Pengurangan stok otomatis perlu disesuaikan pada
                    proses transaksi.
                  </p>
                </div>
              </label>
            </section>

            {/* HARGA */}
            <section>
              <SectionTitle>Harga Produk</SectionTitle>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className={labelClass}>
                    Harga Modal (Rp) *
                  </label>

                  <input
                    type="number"
                    name="costPrice"
                    min="0"
                    step="any"
                    value={form.costPrice}
                    onChange={handleChange}
                    placeholder="Contoh: 25000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Harga Offline (Rp) *
                  </label>

                  <input
                    type="number"
                    name="sellingPrice"
                    min="0"
                    step="any"
                    value={form.sellingPrice}
                    onChange={handleChange}
                    placeholder="Contoh: 32000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Harga Online (Rp)
                  </label>

                  <input
                    type="number"
                    name="onlinePrice"
                    min="0"
                    step="any"
                    value={form.onlinePrice}
                    onChange={handleChange}
                    placeholder="Kosongkan jika sama dengan offline"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Status Produk
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ERROR */}
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-blue-100 bg-blue-50/70 p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
