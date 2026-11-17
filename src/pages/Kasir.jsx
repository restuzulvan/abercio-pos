
import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  X,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useTransactions } from '../context/TransactionContext'

const rupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

export default function Kasir() {
  const { products } = useProducts()
  const { createTransaction } = useTransactions()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [cart, setCart] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [payment, setPayment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [customerName, setCustomerName] = useState('')
  const [message, setMessage] = useState('')

  const categories = useMemo(
    () => [
      'Semua',
      ...new Set(
        products.map((product) => product.category).filter(Boolean)
      ),
    ],
    [products]
  )

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase()

    const matchSearch =
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)

    const matchCategory =
      category === 'Semua' || product.category === category

    return matchSearch && matchCategory
  })

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const change = Math.max(0, Number(payment || 0) - total)

  const addToCart = (product) => {
    if (product.stock <= 0) return

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      )

      if (existing) {
        if (existing.quantity >= product.stock) return prev

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.sellingPrice),
          quantity: 1,
          stock: product.stock,
        },
      ]
    })
  }

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const quantity = item.quantity + amount

        if (quantity < 1 || quantity > item.stock) {
          return item
        }

        return { ...item, quantity }
      })
    )
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const handlePayment = (e) => {
    e.preventDefault()
    setMessage('')

    const result = createTransaction({
      cart,
      payment,
      paymentMethod,
      customerName,
    })

    if (!result.success) {
      setMessage(result.message)
      return
    }

    alert(
      `Transaksi berhasil!\nNomor: ${result.transaction.invoice}\nKembalian: ${rupiah(result.transaction.change)}`
    )

    setCart([])
    setPayment('')
    setCustomerName('')
    setPaymentMethod('Tunai')
    setShowPayment(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Kasir
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola penjualan Abercio Frozen Food.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Daftar produk */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk atau SKU..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                    category === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="text-left bg-white border border-slate-100 rounded-2xl p-4 hover:border-blue-300 hover:shadow-sm transition disabled:opacity-50"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Package size={22} />
                </div>

                <h3 className="font-semibold text-slate-800">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  SKU: {product.sku}
                </p>

                <div className="flex justify-between items-end mt-5 gap-2">
                  <div>
                    <p className="text-xs text-slate-400">
                      Harga jual
                    </p>
                    <p className="font-bold text-blue-600">
                      {rupiah(product.sellingPrice)}
                    </p>
                  </div>

                  <span className="text-xs text-slate-500">
                    Stok: {product.stock}
                  </span>
                </div>

                {product.stock <= 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Stok habis
                  </p>
                )}
              </button>
            ))}

            {filteredProducts.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl p-10 text-center text-slate-400">
                Produk tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Keranjang */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 h-fit xl:sticky xl:top-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-lg text-slate-800">
                Keranjang
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {totalItems} item dipilih
              </p>
            </div>
            <ShoppingCart className="text-blue-600" size={23} />
          </div>

          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart
                  size={38}
                  className="mx-auto text-slate-300"
                />
                <p className="text-sm text-slate-500 mt-3">
                  Keranjang masih kosong.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-slate-100 pb-4"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {rupiah(item.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="font-semibold text-sm">
                      {rupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Total item</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">
                Total pembayaran
              </span>
              <span className="font-bold text-xl text-blue-600">
                {rupiah(total)}
              </span>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:bg-slate-300"
            >
              Lanjut Pembayaran
            </button>
          </div>
        </div>
      </div>

      {/* Modal pembayaran */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handlePayment}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Pembayaran
                </h2>
                <p className="text-sm text-slate-500">
                  Selesaikan transaksi pelanggan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Tutup pembayaran"
              >
                <X size={22} />
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-slate-500">
                Total yang harus dibayar
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {rupiah(total)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nama pelanggan (opsional)
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Pelanggan umum"
                  className="w-full mt-2 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Metode pembayaran
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Tunai', 'Transfer', 'QRIS', 'Debit'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 border rounded-xl text-sm font-medium ${
                        paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Uang diterima
                </label>
                <input
                  type="number"
                  min={total}
                  step="1"
                  required
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  placeholder="Masukkan nominal pembayaran"
                  className="w-full mt-2 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between bg-slate-50 p-4 rounded-xl">
                <span className="text-sm text-slate-500">
                  Kembalian
                </span>
                <span className="font-bold text-green-600">
                  {rupiah(change)}
                </span>
              </div>

              {message && (
                <p className="text-sm text-red-500">{message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard size={18} />
                  Simpan Transaksi
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
