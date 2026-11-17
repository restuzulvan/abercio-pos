
import { Package, Zap, List } from 'lucide-react'

export default function HPPForm({
  form,
  updateField,
}) {
  return (
    <div className="space-y-6">
      {/* Pilih metode */}
      <section className="rounded-2xl bg-slate-50 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-bold text-slate-800">
            <Zap className="text-blue-600" size={21} />
            Pilih Cara Input HPP
          </h2>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
            {form.method === 'quick' ? 'AKUMULASI' : 'RINCIAN'}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => updateField('method', 'detail')}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-semibold ${
              form.method === 'detail'
                ? 'bg-white text-blue-600 shadow'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <List size={19} />
            INPUT 1 PER 1
          </button>

          <button
            type="button"
            onClick={() => updateField('method', 'quick')}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-semibold ${
              form.method === 'quick'
                ? 'bg-white text-blue-600 shadow'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Zap size={19} />
            MODE CEPAT
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {form.method === 'quick'
            ? 'Masukkan total modal produksi dan jumlah hasil produksi.'
            : 'Masukkan rincian setiap bahan baku yang digunakan.'}
        </p>
      </section>

      {/* Informasi produk */}
      <section className="rounded-2xl bg-slate-50 p-5 shadow-lg sm:p-7">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-slate-800">
          <Package className="text-blue-600" />
          Informasi Produk & Batch
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nama Produk Jadi
            </label>

            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Contoh: Dimsum Ayam Udang Premium"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Kategori Produk
              </label>

              <input
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="Contoh: Dimsum"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Jumlah Hasil (Yield)
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={form.yield}
                  onChange={(e) => updateField('yield', e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
                />

                <select
                  value={form.unit}
                  onChange={(e) => updateField('unit', e.target.value)}
                  className="w-32 rounded-xl border border-slate-300 bg-white px-3 py-4 outline-none"
                >
                  <option value="pack">Pack</option>
                  <option value="pcs">Pcs</option>
                  <option value="box">Box</option>
                  <option value="kg">Kg</option>
                  <option value="porsi">Porsi</option>
                </select>
              </div>
            </div>
          </div>

          {form.method === 'quick' ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Total Modal 1 Batch (Rp)
              </label>

              <input
                type="number"
                min="0"
                value={form.totalCapital}
                onChange={(e) => updateField('totalCapital', e.target.value)}
                placeholder="Contoh: 500000"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Biaya Operasional Tambahan (Rp)
              </label>

              <input
                type="number"
                min="0"
                value={form.operationalCost}
                onChange={(e) => updateField('operationalCost', e.target.value)}
                placeholder="Contoh: 20000"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Margin Harga Rekomendasi (%)
            </label>

            <input
              type="number"
              min="0"
              value={form.recommendationMargin}
              onChange={(e) => updateField('recommendationMargin', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
