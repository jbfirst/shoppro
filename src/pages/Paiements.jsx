import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { X, Search } from 'lucide-react'

const METHODES = [
  { id: 'espèces',      label: 'Espèces',                icon: '💵' },
  { id: 'Flooz',        label: 'Flooz (Moov)',           icon: '📱' },
  { id: 'Mixx by Yas',  label: 'Mixx by Yas',            icon: '📲' },
  { id: 'livraison',    label: 'Paiement à la livraison', icon: '🚚' },
  { id: 'virement',     label: 'Virement bancaire',       icon: '🏦' },
]

const methodeStyle = {
  'espèces':     'bg-green-50 text-green-700',
  'Flooz':       'bg-blue-50 text-blue-700',
  'Mixx by Yas': 'bg-purple-50 text-purple-700',
  'livraison':   'bg-orange-50 text-orange-700',
  'virement':    'bg-gray-50 text-gray-700',
}

const statutStyle = {
  'complété':  'bg-green-50 text-green-700',
  'en attente': 'bg-yellow-50 text-yellow-700',
  'échoué':    'bg-red-50 text-red-600',
}

export default function Paiements() {
  const [paiements, setPaiements] = useState([])
  const [filtres, setFiltres] = useState([])
  const [ventes, setVentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filtreMethode, setFiltreMethode] = useState('')
  const [form, setForm] = useState({
    vente_id: '', montant: '', methode: 'espèces',
    statut: 'complété', reference: '', notes: ''
  })

  const fetchAll = async () => {
    const [p, v] = await Promise.all([
      supabase.from('paiements').select('*, ventes(total, clients(nom))').order('created_at', { ascending: false }),
      supabase.from('ventes').select('*, clients(nom)').eq('statut', 'complétée'),
    ])
    setPaiements(p.data || [])
    setFiltres(p.data || [])
    setVentes(v.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    let result = paiements
    if (search) result = result.filter(p =>
      p.ventes?.clients?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference?.toLowerCase().includes(search.toLowerCase())
    )
    if (filtreMethode) result = result.filter(p => p.methode === filtreMethode)
    setFiltres(result)
  }, [search, filtreMethode, paiements])

  const openModal = () => {
    setForm({ vente_id: '', montant: '', methode: 'espèces', statut: 'complété', reference: '', notes: '' })
    setModal(true)
  }

  const closeModal = () => setModal(false)

  const handleVenteChange = (vente_id) => {
    const vente = ventes.find(v => v.id === vente_id)
    setForm({ ...form, vente_id, montant: vente ? vente.total : '' })
  }

  const handleSubmit = async () => {
    if (!form.vente_id || !form.montant) return
    await supabase.from('paiements').insert([{
      vente_id: form.vente_id,
      montant: Number(form.montant),
      methode: form.methode,
      statut: form.statut,
      reference: form.reference,
      notes: form.notes,
    }])
    await supabase.from('notifications').insert([{
      titre: 'Nouveau paiement',
      message: `Paiement de ${Number(form.montant).toLocaleString('fr-FR')} F via ${form.methode}`,
      type: 'success'
    }])
    closeModal()
    fetchAll()
  }

  const totalFiltres = filtres.reduce((acc, p) => acc + Number(p.montant), 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Paiements" action={{ label: '+ Nouveau paiement', onClick: openModal }} />

        <div className="grid grid-cols-4 gap-4 mb-6">
          {METHODES.slice(0, 4).map(m => {
            const total = paiements.filter(p => p.methode === m.id).reduce((acc, p) => acc + Number(p.montant), 0)
            const count = paiements.filter(p => p.methode === m.id).length
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-xs text-gray-500">{m.label}</span>
                </div>
                <div className="text-lg font-semibold text-gray-800">{total.toLocaleString('fr-FR')} F</div>
                <div className="text-xs text-gray-400 mt-1">{count} transaction(s)</div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white text-gray-600"
            value={filtreMethode}
            onChange={e => setFiltreMethode(e.target.value)}
          >
            <option value="">Tous les modes</option>
            {METHODES.map(m => <option key={m.id} value={m.id}>{m.icon} {m.label}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
            <span>{filtres.length} paiement(s)</span>
            <span className="font-semibold text-gray-800">{totalFiltres.toLocaleString('fr-FR')} F</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 mt-20">Chargement...</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Date', 'Client', 'Montant', 'Mode', 'Référence', 'Statut'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-normal px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtres.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{p.ventes?.clients?.nom || '—'}</td>
                    <td className="px-6 py-4 text-gray-800">{Number(p.montant).toLocaleString('fr-FR')} F</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${methodeStyle[p.methode] || 'bg-gray-50 text-gray-600'}`}>
                        {METHODES.find(m => m.id === p.methode)?.icon} {p.methode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.reference || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutStyle[p.statut] || ''}`}>
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtres.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Aucun paiement trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">Nouveau paiement</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3">
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" value={form.vente_id} onChange={e => handleVenteChange(e.target.value)}>
                  <option value="">Sélectionner une vente *</option>
                  {ventes.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.clients?.nom} — {Number(v.total).toLocaleString('fr-FR')} F
                    </option>
                  ))}
                </select>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="Montant *" type="number"
                  value={form.montant}
                  onChange={e => setForm({ ...form, montant: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  {METHODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setForm({ ...form, methode: m.id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                        form.methode === m.id
                          ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{m.icon}</span> {m.label}
                    </button>
                  ))}
                </div>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="Référence transaction (optionnel)"
                  value={form.reference}
                  onChange={e => setForm({ ...form, reference: e.target.value })}
                />
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                  <option value="complété">Complété</option>
                  <option value="en attente">En attente</option>
                  <option value="échoué">Échoué</option>
                </select>
                <textarea
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                  placeholder="Notes (optionnel)" rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-5 justify-end">
                <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Enregistrer</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}