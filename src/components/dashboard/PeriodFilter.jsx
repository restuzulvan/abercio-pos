
import { CalendarDays } from 'lucide-react'

function PeriodFilter({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center">
            <CalendarDays size={22} />
          </div>

          <div>
            <h3 className="font-bold text-primary">
              Periode Dashboard
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Pilih tanggal untuk menyesuaikan data dashboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-bold text-primary">DARI</span>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => onStartChange(e.target.value)}
              className="w-full sm:w-auto border border-blue-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-bold text-primary">SAMPAI</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => onEndChange(e.target.value)}
              className="w-full sm:w-auto border border-blue-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>

      </div>
    </div>
  )
}

export default PeriodFilter
