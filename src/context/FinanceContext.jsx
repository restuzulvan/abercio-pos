
import { createContext, useContext, useState } from 'react'

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState([])

  const addExpense = (data) => {
    const amount = Number(data.amount)

    if (!data.description?.trim()) {
      return {
        success: false,
        message: 'Keterangan pengeluaran wajib diisi.',
      }
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        message: 'Nominal pengeluaran tidak valid.',
      }
    }

    const expense = {
      id: crypto.randomUUID(),
      description: data.description.trim(),
      category: data.category,
      amount,
      paymentMethod: data.paymentMethod,
      date: data.date || new Date().toISOString(),
      note: data.note?.trim() || '',
      createdAt: new Date().toISOString(),
    }

    setExpenses((prev) => [expense, ...prev])

    return {
      success: true,
      message: 'Pengeluaran berhasil ditambahkan.',
    }
  }

  const deleteExpense = (id) => {
    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== id)
    )
  }

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error(
      'useFinance harus digunakan di dalam FinanceProvider'
    )
  }

  return context
}
