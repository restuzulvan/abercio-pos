
import { useMemo, useState } from 'react'
import {
  Search,
  ShoppingCart,
  Store,
  Globe2,
  Tag,
  Package,
  Plus,
  Minus,
  Trash2,
  Zap,
  CreditCard,
  X,
  CheckCircle2,
} from 'lucide-react'

import { useProducts } from '../context/ProductContext'
import { useTransactions } from '../context/TransactionContext'

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function Kasir() {
  const { products = [] } = useProducts()
  const { createTransaction } = useTransactions()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua Kategori')
  const [mode, setMode] = useState('offline')
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [quickDiscount, setQuickDiscount] = useState(0)
  const [showPayment, setShowPayment] = useState(false)
  const [payment, setPayment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [page, setPage] = useState(1)

  const itemsPerPage = 8

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean)

    return ['Semua Kategori', ...new Set(values)]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase()

      const matchSearch =
        product.name?.toLowerCase().includes(keyword) ||
        product.sku?.toLowerCase().includes(keyword)

      const matchCategory =
        category === 'Semua Kategori' ||
        product.category === category

      const enabled =
        mode === 'offline'
          ? product.offlineEnabled !== false
          : product.onlineEnabled !== false

      return (
        matchSearch &&
        matchCategory &&
        enabled &&
        product.status !== 'Nonaktif'
      )
    })
  }, [products, search, category, mode])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  )

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const getProductPrice = (product) => {
    if (mode === 'online' && product.onlinePrice != null) {
      return Number(product.onlinePrice) || 0
    }

    return Number(product.sellingPrice) || 0
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const discount = Math.min(
    Math.max(Number(quickDiscount) || 0, 0),
    subtotal
  )

  const total = Math.max(0, subtotal - discount)

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const addToCart = (product) => {
    const price = getProductPrice(product)

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      )

      if (
        product.trackStock !== false &&
        Number(product.stock || 0) <= 0
      ) {
        alert('Stok produk sedang kosong.')
        return currentCart
      }

      if (existing) {
        if (
          product.trackStock !== false &&
          existing.quantity >= Number(product.stock || 0)
        ) {
          alert('Jumlah produk melebihi stok yang tersedia.')
          return currentCart
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price,
          quantity: 1,
          stock: Number(product.stock || 0),
          trackStock: product.trackStock !== false,
        },
      ]
    })
  }

  const updateQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) return item

          const nextQuantity = item.quantity + amount

          if (nextQuantity <= 0) return null

          if (
            item.trackStock &&
            nextQuantity > item.stock
          ) {
            alert('Jumlah melebihi stok yang tersedia.')
            return item
          }

          return { ...item, quantity: nextQuantity }
        })
        .filter(Boolean)
    )
  }

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    )
  }

  const handlePayment = () => {
    if (cart.length === 0) return

    const paid = Number(payment) || 0

    if (paid < total) {
      alert('Nominal pembayaran masih kurang.')
      return
    }

    if (typeof createTransaction !== 'function') {
      alert('Fungsi penyimpanan transaksi belum tersedia di TransactionContext.')
      return
    }

    try {
      createTransaction({
        cart,
        payment: paid,
        paymentMethod,
        customerName: customerName.trim() || 'Pelanggan Umum',
        discount,
        subtotal,
        total,
        mode,
      })

      setCart([])
      setCustomerName('')
      setQuickDiscount(0)
      setPayment('')
      setShowPayment(false)

      alert('Transaksi berhasil disimpan!')
    } catch (error) {
      console.error(error)
      alert('Transaksi gagal diproses.')
    }
  }

  return (
    <div className="min-h-screen space-y-4 pb-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white shadow-md">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2">
                <ShoppingCart size={21} />
              </div>
              <span className="text-sm font-bold tracking-wide">
                ABERCIO POS
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Transaksi Kasir
            </h1>

            <p className="mt-1 text-sm text-blue-50">
              Pilih produk dan proses pembayaran pelanggan.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-blue-700 shadow-sm">
            <ShoppingCart size={20} />
            {totalItems} item
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm xl:grid-cols-12">

        {/* PRODUCT SECTION */}
        <div className="flex min-w-0 flex-col border-b border-blue-200 xl:col-span-7 xl:border-b-0 xl:border-r">

          <div className="space-y-4 bg-gradient-to-br from-blue-50 to-white p-5">

            {/* SEARCH AND CATEGORY */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <div className="relative sm:col-span-3">
                <Search
                  size={21}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari nama produk atau SKU..."
                  className="h-[52px] w-full rounded-xl border border-blue-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative sm:col-span-2">
                <Tag
                  size={21}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    setPage(1)
                  }}
                  className="h-[52px] w-full appearance-none rounded-xl border border-blue-200 bg-white pl-12 pr-9 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* OFFLINE ONLINE */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-blue-100 p-1.5">
              <button
                onClick={() => {
                  setMode('offline')
                  setPage(1)
                  setCart([])
                }}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${
                  mode === 'offline'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-700 hover:bg-white/60'
                }`}
              >
                <Store size={17} />
                Offline
              </button>

              <button
                onClick={() => {
                  setMode('online')
                  setPage(1)
                  setCart([])
                }}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${
                  mode === 'online'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-700 hover:bg-white/60'
                }`}
              >
                <Globe2 size={17} />
                Online
              </button>
            </div>

            {/* PAGINATION INFO */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-4">
              <p className="text-sm text-gray-600">
                Menampilkan{' '}
                <span className="font-semibold text-blue-700">
                  {filteredProducts.length === 0
                    ? 0
                    : (page - 1) * itemsPerPage + 1}
                  {' - '}
                  {Math.min(page * itemsPerPage, filteredProducts.length)}
                </span>{' '}
                dari {filteredProducts.length} produk
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow">
                  {page}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="min-h-[400px] flex-1 overflow-y-auto p-5">
            {paginatedProducts.length === 0 ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
                <Package size={52} className="text-blue-200" />
                <h3 className="mt-4 font-semibold text-gray-700">
                  Produk tidak ditemukan
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Coba gunakan kata kunci atau kategori lain.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const price = getProductPrice(product)
                  const productDiscount = Number(product.discount) || 0

                  return (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                        <Package
                          size={42}
                          className="text-blue-300 transition group-hover:scale-110"
                        />

                        {productDiscount > 0 && (
                          <span className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
                            -{productDiscount}%
                          </span>
                        )}

                        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                          {mode === 'offline' ? (
                            <Store size={11} />
                          ) : (
                            <Globe2 size={11} />
                          )}
                          {mode === 'offline' ? 'Offline' : 'Online'}
                        </span>
                      </div>

                      <div className="p-3">
                        <h3 className="min-h-10 line-clamp-2 text-sm font-bold text-gray-800">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.sku || '-'} • {product.unit || 'pcs'}
                        </p>

                        <p className="mt-3 text-sm font-bold text-blue-700">
                          {formatRupiah(price)}
                        </p>

                        {product.trackStock !== false && (
                          <p className="mt-2 inline-block rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-600">
                            Stok: {product.stock || 0}
                          </p>
                        )}

                        <button
                          onClick={() => addToCart(product)}
                          disabled={
                            product.trackStock !== false &&
                            Number(product.stock || 0) <= 0
                          }
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <Plus size={17} />
                          Tambah
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* CART SECTION */}
        <div className="flex min-h-[650px] min-w-0 flex-col bg-gradient-to-br from-blue-50 to-blue-100/70 xl:col-span-5">

          {/* CART HEADER */}
          <div className="space-y-4 border-b border-blue-200 p-5">
            <div className="flex items-center gap-3">
              <ShoppingCart size={27} className="text-blue-600" />

              <h2 className="text-xl font-bold text-gray-900">
                Keranjang
              </h2>

              <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-600">
                {totalItems} item
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-xs font-medium text-green-700">
              <Zap size={17} />
              Diskon Cepat aktif di Abercio Frozen Food - Cabang Utama
            </div>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Pelanggan (Opsional)"
              className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* CART ITEMS */}
          <div className="min-h-[250px] flex-1 overflow-y-auto bg-white p-4">
            {cart.length === 0 ? (
              <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <ShoppingCart size={39} className="text-blue-400" />
                </div>

                <h3 className="mt-4 font-bold text-gray-800">
                  Keranjang masih kosong
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Klik produk di sebelah kiri untuk menambahkan
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.sku || '-'}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-blue-700">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                        title="Hapus produk"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-lg border border-blue-200 p-1.5 text-blue-600 hover:bg-blue-50"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="w-7 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-lg border border-blue-200 p-1.5 text-blue-600 hover:bg-blue-50"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gray-800">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOTAL SECTION */}
          <div className="space-y-4 border-t border-blue-200 bg-blue-50/80 p-5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <button
              onClick={() => {
                const value = window.prompt(
                  'Masukkan nominal diskon dalam Rupiah:',
                  String(quickDiscount)
                )

                if (value !== null) {
                  setQuickDiscount(Math.max(0, Number(value) || 0))
                }
              }}
              disabled={cart.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-4 text-sm font-bold text-blue-500 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap size={19} />
              Diskon Cepat (Total Transaksi)
            </button>

            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-blue-200 pt-4">
              <span className="text-lg font-bold text-gray-900">
                Total Harga
              </span>

              <span className="text-2xl font-extrabold text-blue-600">
                {formatRupiah(total)}
              </span>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <CreditCard size={21} />
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Pembayaran
              </h2>

              <button
                onClick={() => setShowPayment(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-gray-500">Total pembayaran</p>
              <p className="mt-1 text-2xl font-extrabold text-blue-600">
                {formatRupiah(total)}
              </p>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Metode Pembayaran
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
                <option value="QRIS">QRIS</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Uang Diterima
              </label>

              <input
                type="number"
                min="0"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Masukkan nominal pembayaran"
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <span className="text-sm text-gray-500">
                Kembalian
              </span>

              <span className="font-bold text-green-600">
                {formatRupiah(
                  Math.max(0, (Number(payment) || 0) - total)
                )}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={
                !payment ||
                Number(payment) < total ||
                total <= 0
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <CheckCircle2 size={19} />
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Kasir
