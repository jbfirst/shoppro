import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart2, Settings, LogOut, TrendingUp, CreditCard } from 'lucide-react'
import { supabase } from '../lib/supabase'

const navItems = [
  { to: '/',          label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/produits',  label: 'Produits',         icon: Package },
  { to: '/ventes',    label: 'Ventes',            icon: ShoppingCart },
  { to: '/clients',   label: 'Clients',           icon: Users },
  { to: '/stock',     label: 'Stock',             icon: BarChart2 },
  { to: '/paiements', label: 'Paiements',         icon: CreditCard },
  { to: '/rapports',  label: 'Rapports',          icon: TrendingUp },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-52 bg-white border-r border-gray-100 flex flex-col z-10">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">
            Shop<span className="text-blue-600">Pro</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 flex flex-col gap-1">
        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`
          }
        >
          <Settings size={16} />
          Paramètres
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
<div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>ShopPro</div>