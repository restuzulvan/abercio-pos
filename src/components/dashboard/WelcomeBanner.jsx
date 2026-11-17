
import { Home, Hand } from 'lucide-react'

function WelcomeBanner({ name = 'Owner' }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 md:p-8 text-white shadow-lg shadow-blue-200">
      <div className="absolute -right-10 -top-16 w-44 h-44 rounded-full bg-white/10" />
      <div className="absolute -left-12 -bottom-24 w-44 h-44 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm font-semibold mb-4">
          <div className="bg-white text-blue-600 p-1.5 rounded-md">
            <Home size={17} />
          </div>
          ABERCIO POS
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Halo, {name}! <Hand className="inline-block" size={30} />
            </h1>

            <p className="mt-3 text-blue-50">
              Selamat datang di dashboard
              <span className="inline-block bg-white text-blue-700 font-semibold rounded-lg px-3 py-1.5 mt-2 sm:mt-0 sm:ml-2">
                Abercio Frozen Food
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeBanner
