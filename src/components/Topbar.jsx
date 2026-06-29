import { Bell, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Topbar({ title, subtitle, action }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setNotifications(data || [])
  }

  useEffect(() => {
    fetchNotifications()
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const nonLues = notifications.filter(n => !n.lu).length

  const marquerLu = async (id) => {
    await supabase.from('notifications').update({ lu: true }).eq('id', id)
    fetchNotifications()
  }

  const toutMarquerLu = async () => {
    await supabase.from('notifications').update({ lu: true }).eq('lu', false)
    fetchNotifications()
  }

  const typeIcon = { success: '✅', warning: '⚠️', error: '🔴', info: 'ℹ️' }

  return (
    <div className="flex items-center justify-between mb-7">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{subtitle || today}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <Search size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors relative"
          >
            <Bell size={18} />
            {nonLues > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-800">
                  Notifications {nonLues > 0 && <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{nonLues}</span>}
                </span>
                {nonLues > 0 && (
                  <button onClick={toutMarquerLu} className="text-xs text-blue-600 hover:text-blue-700">
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">Aucune notification</div>
                )}
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => marquerLu(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.lu ? 'bg-blue-50/30' : ''}`}
                  >
                    <span className="text-base mt-0.5">{typeIcon[n.type] || 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{n.titre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {!n.lu && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}
<div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>ShopPro</div>