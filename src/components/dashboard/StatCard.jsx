
function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const styles = {
    blue: {
      border: 'border-blue-200',
      background: 'bg-gradient-to-br from-white to-blue-50',
      icon: 'bg-blue-100 text-blue-600',
    },
    red: {
      border: 'border-red-200',
      background: 'bg-gradient-to-br from-white to-red-50',
      icon: 'bg-red-100 text-red-600',
    },
    green: {
      border: 'border-green-200',
      background: 'bg-gradient-to-br from-white to-green-50',
      icon: 'bg-green-100 text-green-600',
    },
    purple: {
      border: 'border-purple-200',
      background: 'bg-gradient-to-br from-white to-purple-50',
      icon: 'bg-purple-100 text-purple-600',
    },
  }

  const selectedStyle = styles[color] || styles.blue

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border
      ${selectedStyle.border}
      ${selectedStyle.background}
      p-5 shadow-sm
    `}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${selectedStyle.icon}`}>
          {Icon && <Icon size={23} />}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mt-5">
        {value}
      </h2>
    </div>
  )
}

export default StatCard
