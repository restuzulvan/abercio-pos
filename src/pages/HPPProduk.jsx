
import { useMemo, useState } from 'react'
import { ArrowLeft, Plus, Calculator, Utensils } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHPP } from '../context/HPPContext'

import HPPToolbar from '../components/hpp/HPPToolbar'
import HPPProductCard from '../components/hpp/HPPProductCard'

export default function HPPProduk() {
  const navigate = useNavigate()
  const { hppProducts, deleteHPP } = useHPP()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua Kategori')

  const categories = useMemo(
    () => [
      ...new Set(
        hppProducts.map((item) => item.category).filter(Boolean)
      ),
    ],
    [hppProducts]
  )

  const filteredProducts = useMemo(() => {
    return hppProducts.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      const matchCategory =
        category === 'Semua Kategori' || item.category === category

      return matchSearch && matchCategory
    })
  }, [hppProducts, search, category])

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus data HPP ini?'
    )

    if (confirmed) {
      deleteHPP(id)
    }
  }

  const handleEdit = (product) => {
    navigate('/hitung-hpp', {
      state: { editId: product.id },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 text-white shadow-lg">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-white/15 p-3 transition hover:bg-white/25"
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <Calculator size={18} />
              SUPERPOS
            </div>

            <h1 className="text-3xl font-bold">HPP Produk</h1>

            <p className="mt-1 text-sm text-blue-50">
              Kelola harga pokok produksi dan resep produk Anda.
            </p>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mt-5">
        <HPPToolbar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      </div>

      {/* DAFTAR PRODUK */}
      <div className="mt-6 px-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Daftar Produk HPP
          </h2>

          <p className="text-sm text-slate-500">
            {filteredProducts.length} produk
          </p>
        </div>

        <button
          onClick={() => navigate('/hitung-hpp')}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition hover:bg-blue-700"
        >
          <Plus size={23} />
          Tambah HPP Baru
        </button>

        {/* INFO PAGINATION */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-blue-200 bg-blue-50 px-5 py-4 text-sm text-slate-600">
          <span>
            Menampilkan{' '}
            <b className="text-blue-700">
              {filteredProducts.length > 0 ? 1 : 0} - {filteredProducts.length}
            </b>{' '}
            dari {filteredProducts.length} produk
          </span>

          <span className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700">
            {filteredProducts.length} data
          </span>
        </div>

        {/* CARD PRODUK */}
        <div className="mt-5 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-14 text-center">
              <Utensils
                className="mx-auto mb-3 text-blue-300"
                size={42}
              />

              <h3 className="font-bold text-slate-700">
                Belum ada data HPP
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Tambahkan perhitungan HPP produk pertama Anda.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <HPPProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
