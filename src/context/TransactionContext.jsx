
import { createContext, useContext, useState } from 'react'
import { useProducts } from './ProductContext'

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const { products, processSale } = useProducts()

  const createTransaction = ({
    cart,
    payment,
    paymentMethod,
    customerName,
  }) => {
    if (!cart || cart.length === 0) {
      return {
        success: false,
        message: 'Keranjang masih kosong.',
      }
    }

    const total = cart.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    )

    const paid = Number(payment)

    if (!Number.isFinite(paid) || paid < total) {
      return {
        success: false,
        message: 'Uang pembayaran tidak mencukupi.',
      }
    }

    if (!paymentMethod) {
      return {
        success: false,
        message: 'Pilih metode pembayaran.',
      }
    }

    // Ambil harga dan nama terbaru dari data produk
    const transactionItems = []

    for (const item of cart) {
      const product = products.find(
        (product) => product.id === item.id
      )

      if (!product) {
        return {
          success: false,
          message: `Produk ${item.name} tidak ditemukan.`,
        }
      }

      transactionItems.push({
  productId: product.id,
  name: product.name,
  sku: product.sku,
  price: Number(product.sellingPrice),
  costPrice: Number(product.costPrice),
  quantity: Number(item.quantity),
  subtotal:
    Number(product.sellingPrice) * Number(item.quantity),
  costSubtotal:
    Number(product.costPrice) * Number(item.quantity),
})
    }

    const latestTotal = transactionItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )

    if (paid < latestTotal) {
      return {
        success: false,
        message: 'Uang pembayaran tidak mencukupi.',
      }
    }

    // Kurangi stok melalui ProductContext
    const stockResult = processSale(
      transactionItems.map((item) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
      }))
    )

    if (!stockResult.success) {
      return stockResult
    }

    const now = new Date()

    const transaction = {
      id: crypto.randomUUID(),
      invoice: `INV-${now.getTime()}`,
      date: now.toISOString(),
      customerName: customerName?.trim() || 'Pelanggan Umum',
      items: transactionItems,
      total: latestTotal,
      payment: paid,
      change: paid - latestTotal,
      paymentMethod,
      status: 'Selesai',
    }

    setTransactions((prev) => [transaction, ...prev])

    return {
      success: true,
      message: 'Transaksi berhasil disimpan.',
      transaction,
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error(
      'useTransactions harus digunakan di dalam TransactionProvider'
    )
  }

  return context
}
