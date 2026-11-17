
import { ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react'

function StockHistory({ movements }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">
            Riwayat Pergerakan Stok
          </h3>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Catatan penambahan dan pengurangan persediaan.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4">Tanggal</th>
              <th className="px-5 py-4">Produk</th>
              <th className="px-5 py-4">Jenis</th>
              <th className="px-5 py-4">Jumlah</th>
              <th className="px-5 py-4">Perubahan Stok</th>
              <th className="px-5 py-4">Keterangan</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {movements.length > 0 ? movements.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 text-slate-500">
                  {item.date}
                </td>

                <td className="px-5 py-4 font-semibold text-slate-700">
                  {item.productName}
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.type === 'in'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {item.type === 'in'
                      ? <ArrowDownToLine size={13} />
                      : <ArrowUpFromLine size={13} />}
                    {item.type === 'in' ? 'Masuk' : 'Keluar'}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold">
                  {item.type === 'in' ? '+' : '-'}{item.quantity}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {item.before} → {item.after}
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {item.note}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  Belum ada riwayat pergerakan stok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockHistory
