
import { createContext, useContext, useState } from 'react'

const HPPContext = createContext(null)

export function HPPProvider({ children }) {
  const [hppProducts, setHppProducts] = useState([])

  const addHPP = (data) => {
    const newHPP = {
      id: crypto.randomUUID(),
      ...data,
      yield: Number(data.yield),
      totalCapital: Number(data.totalCapital),
      hppPerUnit: Number(data.hppPerUnit),
      recommendationPrice: Number(data.recommendationPrice),
      createdAt: new Date().toISOString(),
    }

    setHppProducts((prev) => [newHPP, ...prev])
  }

  const updateHPP = (id, data) => {
    setHppProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              yield: Number(data.yield),
              totalCapital: Number(data.totalCapital),
              hppPerUnit: Number(data.hppPerUnit),
              recommendationPrice: Number(data.recommendationPrice),
            }
          : item
      )
    )
  }

  const deleteHPP = (id) => {
    setHppProducts((prev) => prev.filter((item) => item.id !== id))
  }

  const getHPPById = (id) =>
    hppProducts.find((item) => item.id === id)

  return (
    <HPPContext.Provider
      value={{
        hppProducts,
        addHPP,
        updateHPP,
        deleteHPP,
        getHPPById,
      }}
    >
      {children}
    </HPPContext.Provider>
  )
}

export function useHPP() {
  const context = useContext(HPPContext)

  if (!context) {
    throw new Error('useHPP harus digunakan di dalam HPPProvider')
  }

  return context
}
