
import { useState } from 'react'
import {
  ShoppingBag,
  TrendingDown,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import PeriodFilter from '../components/dashboard/PeriodFilter'
import StatCard from '../components/dashboard/StatCard'
import FinancialChart from '../components/dashboard/FinancialChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import LowStockProducts from '../components/dashboard/LowStockProducts'

function getLocalDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function Dashboard() {
  const today = getLocalDate()
  const firstDay = getLocalDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate] = useState(today)

  // Data akan diganti dengan hasil API dari database MySQL.
  const stats = [
    {
      title: 'Total Penjualan',
      value: 'Rp 0',
      icon: ShoppingBag,
      color: 'blue',
    },
    {
      title: 'Total Pengeluaran',
      value: 'Rp 0',
      icon: TrendingDown,
      color: 'red',
    },
    {
      title: 'Laba Kotor',
      value: 'Rp 0',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Laba Bersih',
      value: 'Rp 0',
      icon: TrendingUp,
      color: 'green',
    },
  ]

  return (
    <div className="space-y-6">

      <WelcomeBanner name="Owner" />

      <PeriodFilter
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </section>

      <FinancialChart data={[]} />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <RecentTransactions transactions={[]} />
        <LowStockProducts products={[]} />
      </section>

    </div>
  )
}

export default Dashboard
