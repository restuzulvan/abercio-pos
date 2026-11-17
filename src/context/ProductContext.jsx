
import { createContext, useContext, useState } from 'react'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [stockMovements, setStockMovements] = useState([])

  const addProduct = (data) => {
    const product = {
      id: crypto.randomUUID(),
      ...data,
      stock: Number(data.stock),
      minStock: Number(data.minStock),
      costPrice: Number(data.costPrice),
      sellingPrice: Number(data.sellingPrice),
      createdAt: new Date().toLocaleDateString('id-ID'),
    }

    setProducts((prev) => [...prev, product])
  }

  const updateProduct = (id, data) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              ...data,
              stock: Number(data.stock),
              minStock: Number(data.minStock),
              costPrice: Number(data.costPrice),
              sellingPrice: Number(data.sellingPrice),
            }
          : product
      )
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    )
  }

  const adjustStock = (id, type, quantity, note) => {
    const amount = Number(quantity)
    const product = products.find((item) => item.id === id)

    if (!product || !Number.isInteger(amount) || amount <= 0) {
      return {
        success: false,
        message: 'Jumlah stok tidak valid.',
      }
    }

    const newStock =
      type === 'in'
        ? product.stock + amount
        : product.stock - amount

    if (newStock < 0) {
      return {
        success: false,
        message: 'Stok tidak mencukupi.',
      }
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: newStock }
          : item
      )
    )

    setStockMovements((prev) => [
      {
        id: crypto.randomUUID(),
        productId: id,
        productName: product.name,
        type,
        quantity: amount,
        before: product.stock,
        after: newStock,
        note,
        date: new Date().toLocaleString('id-ID'),
      },
      ...prev,
    ])

    return { success: true }
  }

  // Memproses penjualan dan mengurangi stok produk
  const processSale = (cartItems) => {
    if (!cartItems.length) {
      return {
        success: false,
        message: 'Keranjang masih kosong.',
      }
    }

    // Validasi seluruh produk dan stok sebelum mengurangi stok
    for (const item of cartItems) {
      const product = products.find(
        (product) => product.id === item.id
      )

      if (!product) {
        return {
          success: false,
          message: `Produk ${item.name} tidak ditemukan.`,
        }
      }

      if (
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      ) {
        return {
          success: false,
          message: `Jumlah ${item.name} tidak valid.`,
        }
      }

      if (
  product.trackStock !== false &&
  product.stock < Number(item.quantity)
) {
  return {
    success: false,
    message: `Stok ${product.name} tidak mencukupi.`,
  }
}
    }

    // Hitung kebutuhan stok jika produk yang sama muncul lebih dari sekali
    const quantities = {}

    cartItems.forEach((item) => {
      quantities[item.id] =
        (quantities[item.id] || 0) + Number(item.quantity)
    })

    for (const [id, quantity] of Object.entries(quantities)) {
      const product = products.find((item) => item.id === id)

      if (!product || product.stock < quantity) {
        return {
          success: false,
          message: `Stok ${product?.name || 'produk'} tidak mencukupi.`,
        }
      }
    }

    // Kurangi stok
    setProducts((prev) =>
      prev.map((product) => {
        const quantity = quantities[product.id]

        if (!quantity) return product

        return {
  ...product,
  stock:
    product.trackStock === false
      ? product.stock
      : product.stock - quantity,
}
      })
    )

    // Catat pergerakan stok
    setStockMovements((prev) => {
      const movements = Object.entries(quantities).map(
        ([id, quantity]) => {
          const product = products.find(
            (item) => item.id === id
          )

          return {
            id: crypto.randomUUID(),
            productId: id,
            productName: product.name,
            type: 'out',
            quantity,
            before: product.stock,
            after: product.stock - quantity,
            note: 'Penjualan kasir',
            date: new Date().toLocaleString('id-ID'),
          }
        }
      )

      return [...movements, ...prev]
    })

    return { success: true }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        stockMovements,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        processSale,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error(
      'useProducts harus digunakan di dalam ProductProvider'
    )
  }

  return context
}
