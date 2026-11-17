
import { Menu, CalendarDays } from 'lucide-react'

function Navbar({ onMenuClick }) {
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-30 h-[72px] w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">

        {/* Bagian kiri */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 text-primary"
            aria-label="Buka menu"
          >
            <Menu size={23} />
          </button>

          <div>
            <h1 className="text-base font-bold text-primary">
              ABERCIO POS
            </h1>

            <p className="text-xs text-slate-400">
              Frozen Food Management System
            </p>
          </div>
        </div>

        {/* Bagian kanan */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <CalendarDays
              size={19}
              className="text-accent"
            />

            <span className="text-sm font-medium text-slate-600">
              {today}
            </span>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar
