
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

// Layout
import MainLayout from './components/layout/MainLayout'

// Context Providers
import { ProductProvider } from './context/ProductContext'
import { TransactionProvider } from './context/TransactionContext'
import { FinanceProvider } from './context/FinanceContext'
import { HPPProvider } from './context/HPPContext'

// Pages
import Dashboard from './pages/Dashboard'
import Category from './pages/Category'
import BahanBaku from './pages/BahanBaku'
import Product from './pages/Product'
import HPPProduk from './pages/HPPProduk'
import HitungHPP from './pages/HitungHPP'
import Stock from './pages/Stock'
import Kasir from './pages/Kasir'
import HistoriTransaksi from './pages/HistoriTransaksi'
import Pengeluaran from './pages/Pengeluaran'
import Laporan from './pages/Laporan'
import Pengaturan from './pages/Pengaturan'

// Halaman tidak ditemukan
function ModulePlaceholder({ title }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-primary">
        {title}
      </h1>

      <p className="mt-2 text-gray-500">
        Modul {title} belum tersedia.
      </p>
    </div>
  )
}

function App() {
  return (
    <HPPProvider>
      <ProductProvider>
        <TransactionProvider>
          <FinanceProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  {/* MENU UTAMA */}
                  <Route
                    index
                    element={<Dashboard />}
                  />

                  {/* MASTER DATA */}
                  <Route
                    path="/kategori"
                    element={<Category />}
                  />

                  <Route
                    path="/bahan-baku"
                    element={<BahanBaku />}
                  />

                  <Route
                    path="/produk"
                    element={<Product />}
                  />

                  {/* HPP */}
                  <Route path="/hpp" element={<HPPProduk />} />
<Route path="/hitung-hpp" element={<HitungHPP />} />

                  {/* STOK */}
                  <Route
                    path="/stok"
                    element={<Stock />}
                  />

                  {/* TRANSAKSI */}
                  <Route
                    path="/kasir"
                    element={<Kasir />}
                  />

                  <Route
                    path="/histori"
                    element={<HistoriTransaksi />}
                  />

                  {/* KEUANGAN */}
                  <Route
                    path="/pengeluaran"
                    element={<Pengeluaran />}
                  />

                  <Route
                    path="/laporan"
                    element={<Laporan />}
                  />

                  {/* PENGATURAN */}
                  <Route
                    path="/pengaturan"
                    element={<Pengaturan />}
                  />

                  {/* 404 */}
                  <Route
                    path="*"
                    element={
                      <ModulePlaceholder title="Halaman Tidak Ditemukan" />
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </FinanceProvider>
        </TransactionProvider>
      </ProductProvider>
    </HPPProvider>
  )
}

export default App
