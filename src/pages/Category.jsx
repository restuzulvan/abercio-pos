
import { useMemo, useState } from 'react'

import CategoryStats from '../components/category/CategoryStats'
import CategoryToolbar from '../components/category/CategoryToolbar'
import CategoryTable from '../components/category/CategoryTable'
import CategoryModal from '../components/category/CategoryModal'

function Category() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

  const handleAdd = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData) => {
    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === formData.name.toLowerCase() &&
        category.id !== editingCategory?.id
    )

    if (duplicate) {
      alert('Nama kategori sudah tersedia.')
      return
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? { ...category, ...formData }
            : category
        )
      )
    } else {
      const newCategory = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toLocaleDateString('id-ID'),
      }

      setCategories((prev) => [...prev, newCategory])
    }

    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin menghapus kategori ini?'
    )

    if (!confirmed) return

    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    )
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400 mb-1">
            Master Data / Kategori
          </p>

          <h1 className="text-2xl font-bold text-slate-800">
            Kategori Produk
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola kategori produk Abercio Frozen Food.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <CategoryStats
        totalCategories={categories.length}
        totalProducts={0}
      />

      {/* Category Toolbar */}
      <CategoryToolbar
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
      />

      {/* Category Table */}
      <CategoryTable
        categories={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />

    </div>
  )
}

export default Category
