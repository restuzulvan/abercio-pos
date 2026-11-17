
import { Clock3 } from 'lucide-react'

function RecentTransactions({ transactions = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-primary">Transaksi Terbaru</h2>
          <p className="text-xs text-gray-400 mt-1">
            Riwayat penjualan terbaru
          </p>
        </div>

        <Clock3 size={20} className="text-accent" />
      </div>

      {transactions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-500">
            Belum ada transaksi.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3">No. Transaksi</th>
                <th className="py-3">Tanggal</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{item.invoice}</td>
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.total}</td>
                  <td className="py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default RecentTransactions
