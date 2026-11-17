
import { useMemo, useState } from 'react'
import { Plus, Package, Boxes, Tags } from 'lucide-react'

import { useProducts } from '../context/ProductContext'
import ProductStats from '../components/product/ProductStats'
import ProductToolbar from '../components/product/ProductToolbar'
import ProductTable from '../components/product/ProductTable'
import ProductModal from '../components/product/ProductModal'

function Product() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [channel, setChannel] = useState('Semua')
  const [status, setStatus] = useState('Semua')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const categories = [
    'Sosis',
    'Nugget',
    'Kentang Frozen',
    'Seafood',
    'Daging Olahan',
    'Dimsum',
    'Lain-lain',
  ]

  // Filter produk
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase()

      const matchesSearch =
        (product.name || '').toLowerCase().includes(keyword) ||
        (product.sku || '').toLowerCase().includes(keyword)

      const matchesCategory =
        category === 'Semua' || product.category === category

      const matchesChannel =
        channel === 'Semua' ||
        (channel === 'Offline' && product.offlineEnabled !== false) ||
        (channel === 'Online' && product.onlineEnabled === true)

      const matchesStatus =
        status === 'Semua' ||
        (status === 'Aktif' && product.status !== 'Nonaktif') ||
        (status === 'Nonaktif' && product.status === 'Nonaktif')

      return (
        matchesSearch &&
        matchesCategory &&
        matchesChannel &&
        matchesStatus
      )
    })
  }, [products, search, category, channel, status])

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  )

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage

    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  // Reset halaman ketika filter berubah
  const handleSearch = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleCategory = (value) => {
    setCategory(value)
    setCurrentPage(1)
  }

  const handleChannel = (value) => {
    setChannel(value)
    setCurrentPage(1)
  }

  const handleStatus = (value) => {
    setStatus(value)
    setCurrentPage(1)
  }

  // Tambah produk
  const handleAdd = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  // Edit produk
  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  // Simpan produk
  const handleSubmit = (data) => {
    const duplicate = products.some(
      (product) =>
        product.sku.toLowerCase() === data.sku.toLowerCase() &&
        product.id !== editingProduct?.id
    )

    if (duplicate) {
      alert('Kode SKU sudah digunakan.')
      return
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, data)
    } else {
      addProduct(data)
    }

    setIsModalOpen(false)
    setEditingProduct(null)
  }

  // Hapus produk
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus produk ini?'
    )

    if (confirmed) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-7 text-white shadow-lg shadow-blue-200">
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2">
                <Package size={21} />
              </div>
              <span className="text-sm font-bold tracking-wider">
                ABERCIO POS
              </span>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Daftar Produk
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              Kelola katalog, harga, dan stok produk Anda di sini.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
          >
            <Plus size={20} />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* STATISTIK */}
      <ProductStats products={products} />

      {/* FILTER */}
      <ProductToolbar
        search={search}
        setSearch={handleSearch}
        category={category}
        setCategory={handleCategory}
        categories={categories}
        channel={channel}
        setChannel={handleChannel}
        status={status}
        setStatus={handleStatus}
      />

      {/* INFORMASI HASIL */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-800">
            Data Produk
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Tags size={15} className="text-blue-500" />
          {categories.length} kategori
        </div>
      </div>

      {/* TABEL */}
      <ProductTable
        products={paginatedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white p-4 sm:flex-row">
        <p className="text-xs text-slate-500">
          Halaman {currentPage} dari {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>

          <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
            {currentPage}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />
    </div>
  )
}

export default Product
