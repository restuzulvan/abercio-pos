
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { useProducts } from '../context/ProductContext'
import StockStats from '../components/stock/StockStats'
import StockTable from '../components/stock/StockTable'
import StockAdjustmentModal from '../components/stock/StockAdjustmentModal'
import StockHistory from '../components/stock/StockHistory'

function Stock() {
  const {
    products,
    stockMovements,
    adjustStock,
  } = useProducts()

  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adjustmentType, setAdjustmentType] = useState('in')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
    )
  }, [products, search])

  const handleAdjust = (product, type) => {
    setSelectedProduct(product)
    setAdjustmentType(type)
    setIsModalOpen(true)
  }

  const handleSubmit = (quantity, note) => {
    const result = adjustStock(
      selectedProduct.id,
      adjustmentType,
      quantity,
      note
    )

    if (!result.success) {
      alert(result.message)
      return
    }

    setIsModalOpen(false)
    setSelectedProduct(null)
    alert('Penyesuaian stok berhasil disimpan.')
  }

  return (
    <div className="space-y-6">

      <div>
        <p className="text-sm text-slate-400">
          Master Data / Stok
        </p>
        <h1 className="text-2xl font-bold text-slate-800 mt-1">
          Manajemen Stok
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau dan kelola persediaan produk Abercio Frozen Food.
        </p>
      </div>

      <StockStats products={products} />

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau SKU produk..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <StockTable
        products={filteredProducts}
        onAdjust={handleAdjust}
      />

      <StockHistory movements={stockMovements} />

      <StockAdjustmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        type={adjustmentType}
        onSubmit={handleSubmit}
      />

    </div>
  )
}

export default Stock
