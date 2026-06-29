import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { ShoppingCart, Package, AlertTriangle, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [kpi, setKpi] = useState({ ventesJour: 0, commandes: 0, stockFaible: 0, clients: 0 })
  const [ventesData, setVentesData] = useState([])
  const [dernieresVentes, setDernieresVentes] = useState([])
  const [stockCritique, setStockCritique] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Ventes du jour
    const { data: ventesJour } = await supabase
      .from('ventes')
      .select('total')
      .gte('created_at', today.toISOString())

    // Total commandes
    const { count: commandes } = await supabase
      .from('ventes')
      .select('*', { count: 'exact', head: true })

    // Stock faible
    const { data: stockFaible } = await supabase
      .from('stock')
      .select('quantite, seuil_alerte')

    // Clients
    const { count: clients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    // Ventes 7 derniers jours
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const ventesParJour = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const fin = new Date(d)
      fin.setHours(23, 59, 59, 999)
      const { data } = await supabase
        .from('ventes')
        .select('total')
        .gte('created_at', d.toISOString())
        .lte('created_at', fin.toISOString())
      const total = data?.reduce((acc, v) => acc + Number(v.total), 0) || 0
      ventesParJour.push({ jour: jours[d.getDay()], ventes: total })
    }

    // Dernières ventes
    const { data: dernières } = await supabase
      .from('ventes')
      .select('*, clients(nom)')
      .order('created_at', { ascending: false })
      .limit(5)

    // Stock critique
    const { data: stock } = await supabase
      .from('stock')
      .select('*, produits(nom)')
      .order('quantite', { ascending: true })
      .limit(5)

    setKpi({
      ventesJour: ventesJour?.reduce((acc, v) => acc + Number(v.total), 0) || 0,
      commandes: commandes || 0,
      stockFaible: stockFaible?.filter(s => s.quantite <= s.seuil_alerte).length || 0,
      clients: clients || 0,
    })
    setVentesData(ventesParJour)
    setDernieresVentes(dernières || [])
    setStockCritique(stock || [])
    setLoading(false)
  }

  const statutStyle = {
    'completée': 'bg-green-50 text-green-700',
    'en attente': 'bg-yellow-50 text-yellow-700',
    'annulée': 'bg-red-50 text-red-600',
  }

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Tableau de bord" action={{ label: '+ Nouvelle vente', onClick: () => navigate('/ventes') }} />

        {/* Cartes KPI */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Ventes du jour', value: `${kpi.ventesJour.toLocaleString('fr-FR')} F`, icon: ShoppingCart, badgeStyle: 'bg-green-50 text-green-700', badge: 'Aujourd\'hui' },
            { label: 'Commandes', value: kpi.commandes, icon: Package, badgeStyle: 'bg-green-50 text-green-700', badge: 'Total' },
            { label: 'Stock faible', value: kpi.stockFaible, icon: AlertTriangle, badgeStyle: 'bg-yellow-50 text-yellow-700', badge: 'produits' },
            { label: 'Clients actifs', value: kpi.clients, icon: Users, badgeStyle: 'bg-blue-50 text-blue-700', badge: 'Total' },
          ].map(({ label, value, badge, badgeStyle, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <Icon size={16} className="text-gray-300" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">{value}</div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeStyle}`}>{badge}</span>
            </div>
          ))}
        </div>

        {/* Graphique + Stock critique */}
        <div className="grid grid-cols-5 gap-5 mb-5">
          <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-800 mb-5">Ventes cette semaine</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ventesData} barSize={28}>
                <XAxis dataKey="jour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [`${v.toLocaleString('fr-FR')} F`, 'Ventes']}
                  contentStyle={{ border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="ventes" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-800 mb-5">Stock critique</h2>
            <div className="flex flex-col gap-4">
              {stockCritique.length === 0 && <p className="text-xs text-gray-400">Aucun stock critique</p>}
              {stockCritique.map((s) => {
                const max = Math.max(s.quantite, s.seuil_alerte, 1)
                const pct = Math.min((s.quantite / (max * 2)) * 100, 100)
                const color = s.quantite === 0 ? 'bg-red-400' : s.quantite <= s.seuil_alerte ? 'bg-orange-400' : 'bg-green-400'
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 flex-1 truncate">{s.produits?.nom}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 min-w-8 text-right">{s.quantite} u.</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tableau dernières ventes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-medium text-gray-800 mb-5">Dernières ventes</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date', 'Client', 'Montant', 'Statut'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 font-normal pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dernieresVentes.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-xs">Aucune vente</td></tr>
              )}
              {dernieresVentes.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-gray-500">{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 text-gray-800 font-medium">{v.clients?.nom || '—'}</td>
                  <td className="py-3 text-gray-800">{Number(v.total).toLocaleString('fr-FR')} F</td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutStyle[v.statut] || ''}`}>
                      {v.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}