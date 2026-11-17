
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Tags,
  Package,
  ShoppingCart,
  History,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Boxes,
  Calculator,
  Snowflake,
  X,
  ChevronDown,
} from 'lucide-react'

const menuGroups = [
  {
    title: 'MENU UTAMA',
    items: [
      { label: 'Beranda', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'MASTER DATA',
    items: [
      { label: 'Kategori', path: '/kategori', icon: Tags },
      { label: 'Bahan Baku', path: '/bahan-baku', icon: Boxes },
      { label: 'Produk', path: '/produk', icon: Package },
    ],
  },
  {
    title: 'TRANSAKSI',
    items: [
      { label: 'Kasir', path: '/kasir', icon: ShoppingCart },
      { label: 'Histori Transaksi', path: '/histori', icon: History },
      { label: 'Stok', path: '/stok', icon: Boxes },
    ],
  },
  {
    title: 'KEUANGAN',
    items: [
      { label: 'Pengeluaran', path: '/pengeluaran', icon: Wallet },
      { label: 'Laporan', path: '/laporan', icon: ChartNoAxesCombined },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Pengaturan', path: '/pengaturan', icon: Settings },
    ],
  },
]

const hppItems = [
  { label: 'HPP Produk', path: '/hpp' },
  { label: 'Hitung HPP', path: '/hitung-hpp' },
]

function Sidebar({ mobileOpen, onClose }) {
  const [hppOpen, setHppOpen] = useState(false)
  const location = useLocation()

  const isHppActive = hppItems.some(
    (item) => location.pathname === item.path
  )

  const toggleHpp = () => {
    setHppOpen((prev) => !prev)
  }

  return (
    <>
      {/* Overlay Mobile */}
      {mobileOpen && (
        <button
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-gray-100 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between bg-primary px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Snowflake size={25} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Abercio POS
              </h1>
              <p className="text-[10px] tracking-widest text-blue-200">
                FROZEN FOOD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-3 px-3 text-[11px] font-bold tracking-wider text-gray-400">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 rounded-xl px-4 py-3
                        text-sm font-medium transition-all
                        ${
                          isActive
                            ? 'bg-accent text-white shadow-md shadow-blue-200'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-accent'
                        }
                      `}
                    >
                      <Icon size={19} />
                      {item.label}
                    </NavLink>
                  )
                })}

                {/* Menu HPP */}
                {group.title === 'MASTER DATA' && (
                  <div>
                    <button
                      type="button"
                      onClick={toggleHpp}
                      className={`
                        flex w-full items-center justify-between
                        rounded-xl border-2 px-4 py-2.5
                        text-sm font-medium transition-all
                        ${
                          isHppActive
                            ? 'border-accent bg-blue-50 text-accent'
                            : 'border-transparent text-gray-600 hover:bg-blue-50 hover:text-accent'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <Calculator size={19} />
                        HPP
                      </span>

                      <ChevronDown
                        size={17}
                        className={`transition-transform duration-200 ${
                          hppOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Submenu HPP */}
                    {hppOpen && (
                      <div className="ml-5 mt-1 space-y-1 border-l-2 border-blue-200 py-2 pl-5">
                        {hppItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                              flex items-center gap-3 rounded-lg px-2 py-2.5
                              text-sm transition-all
                              ${
                                isActive
                                  ? 'font-semibold text-blue-600'
                                  : 'text-gray-500 hover:text-blue-600'
                              }
                            `}
                          >
                            <span className="h-2 w-2 rounded-full bg-blue-300" />
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Snowflake size={20} className="text-accent" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                Abercio Frozen Food
              </p>
              <p className="text-xs text-gray-400">
                Mode Operasional
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
