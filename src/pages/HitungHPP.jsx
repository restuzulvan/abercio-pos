
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Zap,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Save,
  CircleCheck,
} from 'lucide-react'

import { useHPP } from '../context/HPPContext'
import HPPForm from '../components/hpp/HPPForm'

const createInitialForm = () => ({
  name: '',
  category: '',
  yield: '20',
  unit: 'pack',
  method: 'detail',
  totalCapital: '',
  recommendationMargin: '30',
  operationalCost: '0',
  ingredients: [
    {
      id: crypto.randomUUID(),
      name: '',
      quantity: '',
      unit: 'kg',
      price: '',
    },
  ],
})

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export default function HitungHPP() {
  const navigate = useNavigate()
  const location = useLocation()

  const { hppProducts, addHPP, updateHPP } = useHPP()

  const editId = location.state?.editId

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(createInitialForm)

  // Mengambil data HPP ketika halaman dibuka dalam mode edit
  useEffect(() => {
    if (!editId) return

    const existing = hppProducts.find((item) => item.id === editId)

    if (!existing) return

    setForm({
      ...createInitialForm(),
      ...existing,
      yield: String(existing.yield),
      totalCapital: String(existing.totalCapital),
      recommendationMargin: String(existing.recommendationMargin ?? 30),
      operationalCost: String(existing.operationalCost ?? 0),
      ingredients: existing.ingredients?.length
        ? existing.ingredients
        : createInitialForm().ingredients,
    })
  }, [editId, hppProducts])

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Mengubah rincian bahan baku
  const updateIngredient = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      ),
    }))
  }

  // Menambah bahan baku
  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: crypto.randomUUID(),
          name: '',
          quantity: '',
          unit: 'kg',
          price: '',
        },
      ],
    }))
  }

  // Menghapus bahan baku
  const removeIngredient = (id) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter(
        (item) => item.id !== id
      ),
    }))
  }

  // Menghitung total harga bahan baku
  const ingredientCapital = useMemo(() => {
    return form.ingredients.reduce((total, item) => {
      return (
        total +
        Number(item.quantity || 0) *
          Number(item.price || 0)
      )
    }, 0)
  }, [form.ingredients])

  // Menghitung total modal produksi
  const totalCapital = useMemo(() => {
    if (form.method === 'quick') {
      return Number(form.totalCapital || 0)
    }

    return (
      ingredientCapital +
      Number(form.operationalCost || 0)
    )
  }, [
    form.method,
    form.totalCapital,
    form.operationalCost,
    ingredientCapital,
  ])

  const yieldAmount = Number(form.yield || 0)

  // Menghitung HPP per unit
  const hppPerUnit =
    yieldAmount > 0 ? totalCapital / yieldAmount : 0

  // Menghitung harga rekomendasi
  const recommendationPrice =
    hppPerUnit *
    (1 + Number(form.recommendationMargin || 0) / 100)

  // Validasi sebelum masuk langkah kedua
  const handleNext = () => {
    if (!form.name.trim()) {
      alert('Nama produk jadi wajib diisi.')
      return
    }

    if (!form.category.trim()) {
      alert('Kategori produk wajib diisi.')
      return
    }

    if (!Number.isFinite(yieldAmount) || yieldAmount <= 0) {
      alert('Jumlah hasil produksi harus lebih dari 0.')
      return
    }

    if (
      Number(form.recommendationMargin) < 0 ||
      !Number.isFinite(Number(form.recommendationMargin))
    ) {
      alert('Margin harga rekomendasi tidak valid.')
      return
    }

    if (form.method === 'quick') {
      if (
        !Number.isFinite(Number(form.totalCapital)) ||
        Number(form.totalCapital) <= 0
      ) {
        alert('Total modal produksi harus lebih dari 0.')
        return
      }
    }

    if (form.method === 'detail') {
      const validIngredients = form.ingredients.filter(
        (item) =>
          item.name.trim() &&
          Number(item.quantity) > 0 &&
          Number(item.price) >= 0 &&
          item.price !== ''
      )

      if (validIngredients.length === 0) {
        alert('Masukkan minimal satu bahan baku dengan data lengkap.')
        return
      }

      const hasInvalidIngredient = form.ingredients.some((item) => {
        if (!item.name.trim()) return false

        return (
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0 ||
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0 ||
          item.price === ''
        )
      })

      if (hasInvalidIngredient) {
        alert('Periksa kembali jumlah dan harga bahan baku.')
        return
      }
    }

    setStep(2)
  }

  // Simpan HPP
  const handleSave = () => {
    if (totalCapital <= 0 || yieldAmount <= 0) {
      alert('Modal dan jumlah hasil produksi harus lebih dari 0.')
      return
    }

    const validIngredients =
      form.method === 'detail'
        ? form.ingredients.filter((item) => item.name.trim())
        : []

    const payload = {
      ...form,
      yield: yieldAmount,
      totalCapital,
      hppPerUnit,
      recommendationPrice,
      recommendationMargin: Number(form.recommendationMargin || 0),
      operationalCost: Number(form.operationalCost || 0),
      ingredients: validIngredients.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    }

    if (editId) {
      updateHPP(editId, payload)
    } else {
      addHPP(payload)
    }

    alert('Data HPP berhasil disimpan.')
    navigate('/hpp')
  }

  return (
    <div className="min-h-screen bg-blue-600 pb-10">
      {/* HEADER */}
      <div className="relative px-5 pb-8 pt-4 text-white">
        <button
          onClick={() => navigate('/hpp')}
          className="absolute left-5 top-4 rounded-lg p-2 hover:bg-white/10"
        >
          <ArrowLeft size={27} />
        </button>

        <div className="pt-1 text-center">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            {editId ? 'Edit HPP' : 'Hitung HPP'}
          </h1>

          {/* STEP INDICATOR */}
          <div className="mx-auto mt-7 flex max-w-xs items-center justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                step >= 1
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-700 text-white'
              }`}
            >
              1
            </div>

            <div className="h-1 w-24 bg-blue-400" />

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                step === 2
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-700 text-white'
              }`}
            >
              2
            </div>
          </div>

          <p className="mt-3 text-sm text-blue-100">
            {step === 1
              ? 'Informasi produk dan modal produksi'
              : 'Rincian dan hasil perhitungan HPP'}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-4">
        {/* LANGKAH 1 */}
        {step === 1 && (
          <HPPForm
            form={form}
            updateField={updateField}
          />
        )}

        {/* LANGKAH 2 */}
        {step === 2 && (
          <>
            {/* RINCIAN BAHAN BAKU */}
            {form.method === 'detail' && (
              <section className="rounded-2xl bg-slate-50 p-5 shadow-lg sm:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">
                      Rincian Bahan Baku
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Masukkan bahan yang digunakan dalam satu batch.
                    </p>
                  </div>

                  <button
                    onClick={addIngredient}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Tambah Bahan
                  </button>
                </div>

                <div className="space-y-4">
                  {form.ingredients.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-bold text-slate-700">
                          Bahan Baku {index + 1}
                        </h3>

                        {form.ingredients.length > 1 && (
                          <button
                            onClick={() => removeIngredient(item.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Nama Bahan
                          </label>

                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateIngredient(item.id, 'name', e.target.value)
                            }
                            placeholder="Contoh: Daging ayam"
                            className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Jumlah Pemakaian
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              updateIngredient(item.id, 'quantity', e.target.value)
                            }
                            placeholder="Contoh: 2"
                            className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Satuan
                          </label>

                          <select
                            value={item.unit}
                            onChange={(e) =>
                              updateIngredient(item.id, 'unit', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none"
                          >
                            <option value="kg">Kg</option>
                            <option value="gram">Gram</option>
                            <option value="liter">Liter</option>
                            <option value="ml">Ml</option>
                            <option value="pcs">Pcs</option>
                            <option value="pack">Pack</option>
                            <option value="butir">Butir</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Harga per Satuan (Rp)
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) =>
                              updateIngredient(item.id, 'price', e.target.value)
                            }
                            placeholder="Contoh: 35000"
                            className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
                        <span className="text-slate-500">
                          Subtotal bahan
                        </span>

                        <b className="text-blue-700">
                          {formatRupiah(
                            Number(item.quantity || 0) *
                              Number(item.price || 0)
                          )}
                        </b>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* HASIL PERHITUNGAN */}
            <section className="rounded-2xl bg-slate-50 p-5 shadow-lg sm:p-7">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <Calculator className="text-blue-600" />
                Hasil Perhitungan HPP
              </h2>

              <div className="space-y-3 rounded-xl bg-blue-50 p-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">Produk</span>
                  <b className="text-right text-slate-800">
                    {form.name}
                  </b>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">Jumlah hasil</span>
                  <b>
                    {yieldAmount} {form.unit}
                  </b>
                </div>

                {form.method === 'detail' && (
                  <>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-600">
                        Total bahan baku
                      </span>
                      <b>{formatRupiah(ingredientCapital)}</b>
                    </div>

                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-600">
                        Biaya operasional
                      </span>
                      <b>{formatRupiah(form.operationalCost)}</b>
                    </div>
                  </>
                )}

                <div className="flex justify-between gap-3 border-t border-blue-200 pt-3">
                  <span className="font-semibold text-slate-700">
                    Total modal produksi
                  </span>

                  <b className="text-blue-700">
                    {formatRupiah(totalCapital)}
                  </b>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-blue-600 p-5 text-white">
                <p className="text-sm text-blue-100">
                  HPP per {form.unit}
                </p>

                <h3 className="mt-1 text-3xl font-extrabold">
                  {formatRupiah(hppPerUnit)}
                </h3>

                <p className="mt-2 text-xs text-blue-100">
                  Total modal produksi dibagi jumlah hasil produksi.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-emerald-800">
                  Harga Rekomendasi Jual
                </p>

                <h3 className="mt-1 text-2xl font-extrabold text-emerald-700">
                  {formatRupiah(recommendationPrice)}
                </h3>

                <p className="mt-1 text-xs text-emerald-700">
                  Berdasarkan margin {Number(form.recommendationMargin || 0)}%.
                </p>
              </div>
            </section>
          </>
        )}

        {/* TOMBOL NAVIGASI */}
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-blue-700 shadow"
            >
              <ChevronLeft size={19} />
              Kembali
            </button>
          ) : (
            <button
              onClick={() => navigate('/hpp')}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800"
            >
              <ArrowLeft size={19} />
              Batal
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-blue-700 shadow hover:bg-blue-50"
            >
              Lanjutkan
              <ChevronRight size={19} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 font-bold text-white shadow hover:bg-emerald-600"
            >
              <Save size={19} />
              <CircleCheck size={19} />
              Simpan HPP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
