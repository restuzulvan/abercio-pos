
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

function FinancialChart({ data = [] }) {
  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-accent rounded-full" />
        <h2 className="text-lg font-bold text-slate-900">
          Performa Keuangan pada Periode Terpilih
        </h2>
      </div>

      {data.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#DBEAFE" strokeDasharray="4 4" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={formatRupiah}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />

              <Line
                type="monotone"
                dataKey="sales"
                name="Penjualan"
                stroke="#2563EB"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                name="Pengeluaran"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <span className="text-2xl text-blue-500">↗</span>
          </div>

          <p className="font-semibold text-gray-700">
            Belum ada data keuangan
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Grafik akan muncul setelah transaksi tersimpan.
          </p>
        </div>
      )}
    </div>
  )
}

export default FinancialChart
