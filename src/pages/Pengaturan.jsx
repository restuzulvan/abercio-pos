
import { useState } from 'react'
import {
  UserRound,
  Settings,
  Pencil,
  LockKeyhole,
  Percent,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronLeft,
  Store,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'

function Pengaturan() {
  const [openMenu, setOpenMenu] = useState(true)
  const [activeMenu, setActiveMenu] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [profile, setProfile] = useState({
    storeName: 'Abercio Frozen Food',
    ownerName: 'Raras Pradita',
  })

  const [password, setPassword] = useState({
    old: '',
    new: '',
    confirm: '',
  })

  const [percentage, setPercentage] = useState(10)
  const [selectedStore, setSelectedStore] = useState('Cabang Utama')

  const menus = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: Pencil,
    },
    {
      id: 'password',
      title: 'Change Password',
      icon: LockKeyhole,
    },
    {
      id: 'percentage',
      title: 'Persentase Online',
      icon: Percent,
    },
    {
      id: 'store',
      title: 'Switch Store',
      icon: RefreshCw,
    },
    {
      id: 'export',
      title: 'Export Data',
      icon: Download,
    },
  ]

  const toggleMenu = (id) => {
    setActiveMenu((prev) => (prev === id ? '' : id))
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    alert('Profil berhasil diperbarui!')
    setActiveMenu('')
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()

    if (password.new !== password.confirm) {
      alert('Konfirmasi password tidak sama!')
      return
    }

    if (!password.old || !password.new) {
      alert('Lengkapi semua kolom password!')
      return
    }

    alert('Password berhasil diperbarui!')
    setPassword({ old: '', new: '', confirm: '' })
    setActiveMenu('')
  }

  const handlePercentageSave = (e) => {
    e.preventDefault()
    alert(`Persentase online disimpan: ${percentage}%`)
    setActiveMenu('')
  }

  const handleExport = () => {
    const data = {
      profile,
      percentageOnline: percentage,
      selectedStore,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'abercio-pos-data.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen space-y-5 pb-5">

      {/* PROFILE HEADER */}
      <div className="relative flex min-h-[311px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-7 text-center text-white shadow-lg shadow-blue-200">

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative mb-4 flex items-center gap-2">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-blue-600">
            <UserRound size={19} />
          </div>

          <span className="text-sm font-bold tracking-wide">
            SUPERPOS
          </span>
        </div>

        {/* LOGO TOKO */}
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[5px] border-white bg-white/20 p-2 shadow-lg ring-4 ring-white/30">
          <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-blue-100 text-center">
            <div>
              <Store size={36} className="mx-auto text-blue-600" />
              <span className="mt-1 block text-[9px] font-extrabold text-blue-700">
                ABERCIO
              </span>
            </div>
          </div>
        </div>

        <h1 className="relative mt-6 text-2xl font-bold">
          {profile.storeName}
        </h1>

        <p className="relative mt-1 text-base text-blue-50">
          {profile.ownerName}
        </p>
      </div>

      {/* SETTINGS PANEL */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-100 shadow-sm">

        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />

        {/* SETTINGS HEADER */}
        <button
          type="button"
          onClick={() => setOpenMenu(!openMenu)}
          className="flex w-full items-center justify-between border-b border-blue-200 px-5 py-6 text-left transition hover:bg-blue-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <Settings size={23} fill="white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pengaturan
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                5 menu pengaturan
              </p>
            </div>
          </div>

          <ChevronDown
            size={22}
            className={`text-blue-600 transition-transform ${
              openMenu ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* SETTINGS MENU */}
        {openMenu && (
          <div>
            {menus.map((menu) => {
              const Icon = menu.icon
              const isActive = activeMenu === menu.id

              return (
                <div key={menu.id} className="border-b border-blue-100 last:border-b-0">

                  <button
                    type="button"
                    onClick={() => toggleMenu(menu.id)}
                    className={`flex w-full items-center justify-between px-5 py-5 text-left transition ${
                      isActive
                        ? 'bg-blue-100'
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Icon size={20} />
                      </div>

                      <span className="text-lg font-medium text-gray-900">
                        {menu.title}
                      </span>
                    </div>

                    <ChevronLeft
                      size={19}
                      className={`text-blue-500 transition-transform ${
                        isActive ? '-rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* EDIT PROFILE */}
                  {isActive && menu.id === 'profile' && (
                    <form
                      onSubmit={handleProfileSave}
                      className="space-y-4 bg-white/70 p-5"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Nama Toko
                        </label>

                        <input
                          type="text"
                          value={profile.storeName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              storeName: e.target.value,
                            })
                          }
                          className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Nama Pemilik
                        </label>

                        <input
                          type="text"
                          value={profile.ownerName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              ownerName: e.target.value,
                            })
                          }
                          className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white transition hover:bg-blue-700"
                      >
                        <Save size={18} />
                        Simpan Profil
                      </button>
                    </form>
                  )}

                  {/* CHANGE PASSWORD */}
                  {isActive && menu.id === 'password' && (
                    <form
                      onSubmit={handlePasswordSave}
                      className="space-y-4 bg-white/70 p-5"
                    >
                      {[
                        { key: 'old', label: 'Password Lama' },
                        { key: 'new', label: 'Password Baru' },
                        { key: 'confirm', label: 'Konfirmasi Password Baru' },
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            {item.label}
                          </label>

                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password[item.key]}
                              onChange={(e) =>
                                setPassword({
                                  ...password,
                                  [item.key]: e.target.value,
                                })
                              }
                              className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 pr-12 outline-none focus:border-blue-500"
                              required
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? (
                                <EyeOff size={19} />
                              ) : (
                                <Eye size={19} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700"
                      >
                        <Save size={18} />
                        Simpan Password
                      </button>
                    </form>
                  )}

                  {/* ONLINE PERCENTAGE */}
                  {isActive && menu.id === 'percentage' && (
                    <form
                      onSubmit={handlePercentageSave}
                      className="space-y-4 bg-white/70 p-5"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Persentase Harga Online (%)
                        </label>

                        <div className="flex h-12 items-center rounded-xl border border-blue-200 bg-white px-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={percentage}
                            onChange={(e) =>
                              setPercentage(Number(e.target.value))
                            }
                            className="w-full outline-none"
                          />

                          <span className="font-bold text-blue-600">%</span>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          Atur persentase tambahan harga untuk penjualan online.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700"
                      >
                        <Save size={18} />
                        Simpan Persentase
                      </button>
                    </form>
                  )}

                  {/* SWITCH STORE */}
                  {isActive && menu.id === 'store' && (
                    <div className="space-y-4 bg-white/70 p-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Pilih Toko / Cabang
                        </label>

                        <select
                          value={selectedStore}
                          onChange={(e) => setSelectedStore(e.target.value)}
                          className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 outline-none focus:border-blue-500"
                        >
                          <option value="Cabang Utama">Cabang Utama</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Toko aktif: ${selectedStore}`)}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700"
                      >
                        <RefreshCw size={18} />
                        Switch Store
                      </button>

                      <p className="text-xs text-gray-500">
                        Saat ini hanya tersedia Cabang Utama. Cabang lain dapat ditambahkan kemudian.
                      </p>
                    </div>
                  )}

                  {/* EXPORT DATA */}
                  {isActive && menu.id === 'export' && (
                    <div className="space-y-4 bg-white/70 p-5">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Export Data Abercio POS
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Unduh data pengaturan saat ini dalam format JSON.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleExport}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700"
                      >
                        <Download size={18} />
                        Export Data
                      </button>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pengaturan
