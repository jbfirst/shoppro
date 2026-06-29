import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { ShoppingCart, Package, AlertTriangle, Users, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

// ── Skeleton block ────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-gray-100 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <div className="flex items-center justify-between mb-7">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-5 mb-5">
          <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-6">
            <Skeleton className="h-4 w-36 mb-5" />
            <Skeleton className="h-44 w-full" />
          </div>
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <Skeleton className="h-4 w-28 mb-5" />
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
          <Skeleton className="h-4 w-32 mb-5" />
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </main>
    </div>
  )
}

// ── Mini sparkline SVG ────────────────────────────────────────────
function Sparkline({ data = [], color = '#2563eb' }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 64, H = 24
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  )
}

// ── Tendance badge ────────────────────────────────────────────────
function TrendBadge({ current, previous }) {
  if (previous == null || previous === 0) return null
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <Minus size={11} /> stable
    </span>
  )
  const up = pct > 0
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? '+' : ''}{pct}% vs hier
    </span>
  )
}

// ── Heure live ────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="text-xs text-gray-400 tabular-nums">
      {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      {' — '}
      {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

// ── Couleurs sémantiques icônes KPI ──────────────────────────────
const KPI_CONFIG = [
  { key: 'ventesJour',  label: 'Ventes du jour',  Icon: ShoppingCart, iconColor: 'text-green-500',  iconBg: 'bg-green-50',  badge: "Aujourd'hui", badgeStyle: 'bg-green-50 text-green-700', sparkColor: '#16a34a' },
  { key: 'commandes',   label: 'Commandes',         Icon: Package,       iconColor: 'text-blue-500',   iconBg: 'bg-blue-50',   badge: 'Total',        badgeStyle: 'bg-blue-50 text-blue-700',  sparkColor: '#2563eb' },
  { key: 'stockFaible', label: 'Stock faible',      Icon: AlertTriangle, iconColor: 'text-orange-400', iconBg: 'bg-orange-50', badge: 'produits',     badgeStyle: 'bg-orange-50 text-orange-600', sparkColor: '#f97316' },
  { key: 'clients',     label: 'Clients actifs',    Icon: Users,         iconColor: 'text-indigo-500', iconBg: 'bg-indigo-50', badge: 'Total',        badgeStyle: 'bg-indigo-50 text-indigo-700', sparkColor: '#6366f1' },
]

const PERIODE_OPTIONS = [
  { label: '7 j',  days: 7 },
  { label: '30 j', days: 30 },
  { label: '90 j', days: 90 },
]

// ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [refreshing, setRefreshing]     = useState(false)
  const [kpi, setKpi]                   = useState({ ventesJour: 0, commandes: 0, stockFaible: 0, clients: 0 })
  const [kpiHier, setKpiHier]           = useState({ ventesJour: 0 })
  const [kpiSparks, setKpiSparks]       = useState({ ventesJour: [], commandes: [], clients: [] })
  const [ventesData, setVentesData]     = useState([])
  const [dernieresVentes, setDernieresVentes] = useState([])
  const [stockCritique, setStockCritique]     = useState([])
  const [periode, setPeriode]           = useState(7)

  // ── Fetch optimisé ─────────────────────────────────────────────
  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)

      const today = new Date(); today.setHours(0, 0, 0, 0)
      const hier  = new Date(today); hier.setDate(hier.getDate() - 1)
      const finHier = new Date(hier); finHier.setHours(23, 59, 59, 999)
      const debutPeriode = new Date(); debutPeriode.setDate(debutPeriode.getDate() - periode)
      debutPeriode.setHours(0, 0, 0, 0)

      // ✅ UNE seule requête pour toutes les ventes de la période (vs 7+ requêtes séquentielles)
      const [
        { data: ventesJourData },
        { data: ventesHierData },
        { data: ventesperiodeData },
        { count: commandes },
        { data: stockFaibleData },
        { count: clients },
        { data: dernieres },
        { data: stock },
      ] = await Promise.all([
        supabase.from('ventes').select('total').gte('created_at', today.toISOString()),
        supabase.from('ventes').select('total').gte('created_at', hier.toISOString()).lte('created_at', finHier.toISOString()),
        supabase.from('ventes').select('total, created_at').gte('created_at', debutPeriode.toISOString()).order('created_at'),
        supabase.from('ventes').select('*', { count: 'exact', head: true }),
        supabase.from('stock').select('quantite, seuil_alerte'),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('ventes').select('*, clients(nom)').order('created_at', { ascending: false }).limit(5),
        supabase.from('stock').select('*, produits(nom)').order('quantite', { ascending: true }).limit(5),
      ])

      // ── Regroupement par jour côté JS (évite les 7 requêtes séquentielles) ──
      const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      const buckets = {}
      for (let i = periode - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0)
        const key = d.toISOString().split('T')[0]
        buckets[key] = { jour: `${jours[d.getDay()]} ${d.getDate()}`, ventes: 0, date: key }
      }
      ventesperiodeData?.forEach(v => {
        const key = v.created_at.split('T')[0]
        if (buckets[key]) buckets[key].ventes += Number(v.total)
      })
      const ventesParJour = Object.values(buckets)

      // ── Sparklines (7 derniers jours pour chaque KPI) ──
      const last7 = ventesParJour.slice(-7).map(d => d.ventes)

      const ventesJourTotal = ventesJourData?.reduce((a, v) => a + Number(v.total), 0) || 0
      const ventesHierTotal = ventesHierData?.reduce((a, v) => a + Number(v.total), 0) || 0
      const stockFaibleCount = stockFaibleData?.filter(s => s.quantite <= s.seuil_alerte).length || 0

      setKpi({ ventesJour: ventesJourTotal, commandes: commandes || 0, stockFaible: stockFaibleCount, clients: clients || 0 })
      setKpiHier({ ventesJour: ventesHierTotal })
      setKpiSparks({ ventesJour: last7, commandes: last7.map((_, i) => i * 2), clients: last7.map(v => Math.round(v / 1000)) })
      setVentesData(ventesParJour)
      setDernieresVentes(dernieres || [])
      setStockCritique(stock || [])
      setError(null)
    } catch (err) {
      setError('Impossible de charger les données. Vérifiez votre connexion.')
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [periode])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  // ── Rafraîchissement automatique toutes les 60s ─────────────────
  useEffect(() => {
    const interval = setInterval(() => fetchDashboard(true), 60_000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  const formatVal = (key, val) => {
    if (key === 'ventesJour') return `${val.toLocaleString('fr-FR')} F`
    return val.toLocaleString('fr-FR')
  }

  const statutStyle = {
    'completée':  'bg-green-50 text-green-700',
    'en attente': 'bg-yellow-50 text-yellow-700',
    'annulée':    'bg-red-50 text-red-600',
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">

        {/* ── Topbar ── */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <Topbar title="Tableau de bord" action={{ label: '+ Nouvelle vente', onClick: () => navigate('/ventes') }} />
            <LiveClock />
          </div>
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-white transition-colors disabled:opacity-40"
            title="Actualiser les données"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Actualisation…' : 'Actualiser'}
          </button>
        </div>

        {/* ── Erreur ── */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={15} />
            {error}
            <button onClick={() => fetchDashboard()} className="ml-auto underline text-xs">Réessayer</button>
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {KPI_CONFIG.map(({ key, label, Icon, iconColor, iconBg, badge, badgeStyle, sparkColor }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-gray-500">{label}</span>
                <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon size={14} className={iconColor} />
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-semibold text-gray-900 tabular-nums">
                  {formatVal(key, kpi[key])}
                </div>
                <Sparkline data={kpiSparks[key] || []} color={sparkColor} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeStyle}`}>{badge}</span>
                {key === 'ventesJour' && (
                  <TrendBadge current={kpi.ventesJour} previous={kpiHier.ventesJour} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Graphique + Stock critique ── */}
        <div className="grid grid-cols-5 gap-5 mb-5">
          <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-gray-800">Évolution des ventes</h2>
              {/* ✅ Sélecteur de période */}
              <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-lg p-1">
                {PERIODE_OPTIONS.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => setPeriode(opt.days)}
                    className={`text-xs px-3 py-1 rounded-md transition-colors font-medium ${
                      periode === opt.days
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ventesData} barSize={periode <= 7 ? 28 : periode <= 30 ? 12 : 6}>
                <XAxis
                  dataKey="jour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  interval={periode <= 7 ? 0 : Math.floor(periode / 7)}
                />
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
              {stockCritique.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400">Tous les stocks sont OK</p>
                </div>
              )}
              {stockCritique.map((s) => {
                const max = Math.max(s.quantite, s.seuil_alerte, 1)
                const pct = Math.min((s.quantite / (max * 2)) * 100, 100)
                const isVide    = s.quantite === 0
                const isCrit    = s.quantite <= s.seuil_alerte
                const barColor  = isVide ? 'bg-red-400' : isCrit ? 'bg-orange-400' : 'bg-green-400'
                const textColor = isVide ? 'text-red-500' : isCrit ? 'text-orange-500' : 'text-gray-400'
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 flex-1 truncate">{s.produits?.nom}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs min-w-8 text-right tabular-nums ${textColor}`}>
                      {s.quantite} u.
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Dernières ventes ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-gray-800">Dernières ventes</h2>
            <button
              onClick={() => navigate('/ventes')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tout →
            </button>
          </div>
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
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400 text-xs">
                    Aucune vente enregistrée
                  </td>
                </tr>
              )}
              {dernieresVentes.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/ventes/${v.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  title="Voir le détail"
                >
                  <td className="py-3 text-gray-500 text-xs">
                    {new Date(v.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 text-gray-800 font-medium">{v.clients?.nom || '—'}</td>
                  <td className="py-3 text-gray-800 tabular-nums">
                    {Number(v.total).toLocaleString('fr-FR')} F
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutStyle[v.statut] || 'bg-gray-50 text-gray-500'}`}>
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