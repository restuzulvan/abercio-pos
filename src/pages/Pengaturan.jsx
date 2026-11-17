
import { useEffect, useState } from 'react'
import {
  Store,
  User,
  Receipt,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
} from 'lucide-react'

const defaultSettings = {
  storeName: 'Abercio Frozen Food',
  ownerName: '',
  phone: '',
  address: '',
  email: '',
  cashierName: '',
  receiptMessage: 'Terima kasih telah berbelanja!',
  showAddress: true,
  showPhone: true,
  showCashier: true,
  currency: 'IDR',
}

function getSavedSettings() {
  try {
    const saved = localStorage.getItem('abercio-settings')
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export default function Pengaturan() {
  const [settings, setSettings] = useState(getSavedSettings)
  const [activeTab, setActiveTab] = useState('toko')
  const [savedMessage, setSavedMessage] = useState('')

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    setSavedMessage('')
  }

  const handleSave = (e) => {
    e.preventDefault()

    localStorage.setItem('abercio-settings', JSON.stringify(settings))
    setSavedMessage('Pengaturan berhasil disimpan.')
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin mengembalikan pengaturan ke awal?'
    )

    if (!confirmed) return

    setSettings(defaultSettings)
    localStorage.removeItem('abercio-settings')
    setSavedMessage('Pengaturan berhasil direset.')
  }

  const tabs = [
    { id: 'toko', label: 'Informasi Toko', icon: Store },
    { id: 'kasir', label: 'Pengaturan Kasir', icon: SettingsIcon },
    { id: 'struk', label: 'Pengaturan Struk', icon: Receipt },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Atur informasi toko dan preferensi aplikasi kasir.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Informasi Toko */}
        {activeTab === 'toko' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Store size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  Informasi Toko
                </h2>
                <p className="text-sm text-slate-500">
                  Informasi identitas Abercio Frozen Food.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nama Toko
                </label>
                <input
                  required
                  value={settings.storeName}
                  onChange={(e) => updateSetting('storeName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nama toko"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nama Pemilik
                </label>
                <input
                  value={settings.ownerName}
                  onChange={(e) => updateSetting('ownerName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nama pemilik toko"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nomor Telepon
                </label>
                <input
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Toko
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="email@contoh.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Alamat Toko
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan alamat lengkap toko"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pengaturan Kasir */}
        {activeTab === 'kasir' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <User size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  Pengaturan Kasir
                </h2>
                <p className="text-sm text-slate-500">
                  Atur informasi kasir yang bertugas.
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama Kasir
              </label>
              <input
                value={settings.cashierName}
                onChange={(e) => updateSetting('cashierName', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Masukkan nama kasir"
              />
              <p className="mt-2 text-xs text-slate-400">
                Nama ini dapat ditampilkan pada struk transaksi.
              </p>
            </div>
          </div>
        )}

        {/* Pengaturan Struk */}
        {activeTab === 'struk' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Receipt size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  Pengaturan Struk
                </h2>
                <p className="text-sm text-slate-500">
                  Atur informasi yang ditampilkan pada struk.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'showAddress', label: 'Tampilkan alamat toko' },
                { key: 'showPhone', label: 'Tampilkan nomor telepon' },
                { key: 'showCashier', label: 'Tampilkan nama kasir' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                </label>
              ))}

              <div className="pt-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pesan Penutup Struk
                </label>
                <textarea
                  rows={3}
                  value={settings.receiptMessage}
                  onChange={(e) =>
                    updateSetting('receiptMessage', e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Pesan penutup struk"
                />
              </div>

              {/* Preview */}
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <h3 className="font-bold text-slate-800">
                  {settings.storeName || 'Nama Toko'}
                </h3>

                {settings.showAddress && settings.address && (
                  <p className="mt-1 text-xs text-slate-500">
                    {settings.address}
                  </p>
                )}

                {settings.showPhone && settings.phone && (
                  <p className="mt-1 text-xs text-slate-500">
                    {settings.phone}
                  </p>
                )}

                <div className="my-3 border-t border-dashed border-slate-300" />

                <p className="text-xs text-slate-500">
                  Contoh tampilan struk transaksi
                </p>

                {settings.showCashier && settings.cashierName && (
                  <p className="mt-2 text-xs text-slate-500">
                    Kasir: {settings.cashierName}
                  </p>
                )}

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {settings.receiptMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pesan */}
        {savedMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {savedMessage}
          </div>
        )}

        {/* Tombol */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={17} />
            Reset Pengaturan
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Save size={17} />
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  )
}
