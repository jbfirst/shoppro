import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { X, Plus, Trash2, Search } from 'lucide-react'
import { exportVentesPDF } from '../utils/exportPDF'

export default function Ventes() {
  const [ventes, setVentes] = useState([])
  const [filtres, setFiltres] = useState([])
  const [clients, setClients] = useState([])
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')
  const [form, setForm] = useState({ client_id: '', statut: 'complétée' })
  const [lignes, setLignes] = useState([{ produit_id: '', quantite: 1, prix_unitaire: 0 }])

  const fetchAll = async () => {
    const [v, c, p] = await Promise.all([
      supabase.from('ventes').select('*, clients(nom)').order('created_at', { ascending: false }),
      supabase.from('clients').select('*'),
      supabase.from('produits').select('*'),
    ])
    setVentes(v.data || [])
    setFiltres(v.data || [])
    setClients(c.data || [])
    setProduits(p.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    let result = ventes
    if (search) result = result.filter(v =>
      v.clients?.nom.toLowerCase().includes(search.toLowerCase())
    )
    if (statut) result = result.filter(v => v.statut === statut)
    setFiltres(result)
  }, [search, statut, ventes])

  const openModal = () => {
    setForm({ client_id: '', statut: 'complétée' })
    setLignes([{ produit_id: '', quantite: 1, prix_unitaire: 0 }])
    setModal(true)
  }

  const closeModal = () => setModal(false)

  const updateLigne = (index, field, value) => {
    const updated = [...lignes]
    updated[index][field] = value
    if (field === 'produit_id') {
      const produit = produits.find(p => p.id === value)
      updated[index].prix_unitaire = produit ? produit.prix : 0
    }
    setLignes(updated)
  }

  const addLigne = () => setLignes([...lignes, { produit_id: '', quantite: 1, prix_unitaire: 0 }])
  const removeLigne = (index) => setLignes(lignes.filter((_, i) => i !== index))

  const total = lignes.reduce((acc, l) => acc + (Number(l.prix_unitaire) * Number(l.quantite)), 0)

  const handleSubmit = async () => {
    if (!form.client_id || lignes.some(l => !l.produit_id)) return
    const { data: vente } = await supabase.from('ventes').insert([{
      client_id: form.client_id,
      statut: form.statut,
      total
    }]).select()

    if (vente?.[0]) {
      await supabase.from('ventes_details').insert(
        lignes.map(l => ({
          vente_id: vente[0].id,
          produit_id: l.produit_id,
          quantite: Number(l.quantite),
          prix_unitaire: Number(l.prix_unitaire)
        }))
      )
      for (const l of lignes) {
        const { data: s } = await supabase.from('stock').select('quantite').eq('produit_id', l.produit_id).single()
        if (s) await supabase.from('stock').update({
          quantite: s.quantite - Number(l.quantite),
          updated_at: new Date().toISOString()
        }).eq('produit_id', l.produit_id)
      }
    }
    closeModal()
    fetchAll()
  }

  const statutStyle = {
    'complétée': 'bg-green-50 text-green-700',
    'en attente': 'bg-yellow-50 text-yellow-700',
    'annulée': 'bg-red-50 text-red-600',
  }

  const totalFiltres = filtres.reduce((acc, v) => acc + Number(v.total), 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Ventes" action={{ label: '+ Nouvelle vente', onClick: openModal }} />

        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
              placeholder="Rechercher un client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white text-gray-600"
            value={statut}
            onChange={e => setStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="complétée">Complétée</option>
            <option value="en attente">En attente</option>
            <option value="annulée">Annulée</option>
          </select>
          <button
            onClick={() => exportVentesPDF(filtres)}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors bg-white"
          >
            📄 Exporter PDF
          </button>
          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
            <span>{filtres.length} vente(s)</span>
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
                  {['Date', 'Client', 'Total', 'Statut'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-normal px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtres.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{v.clients?.nom || '—'}</td>
                    <td className="px-6 py-4 text-gray-800">{Number(v.total).toLocaleString('fr-FR')} F</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutStyle[v.statut] || ''}`}>
                        {v.statut}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtres.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Aucune vente trouvée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">Nouvelle vente</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                  <option value="">Sélectionner un client *</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                  <option value="complétée">Complétée</option>
                  <option value="en attente">En attente</option>
                  <option value="annulée">Annulée</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {lignes.map((l, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" value={l.produit_id} onChange={e => updateLigne(i, 'produit_id', e.target.value)}>
                      <option value="">Produit *</option>
                      {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                    </select>
                    <input className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" type="number" min="1" value={l.quantite} onChange={e => updateLigne(i, 'quantite', e.target.value)} placeholder="Qté" />
                    <span className="text-xs text-gray-500 min-w-24 text-right">
                      {(Number(l.prix_unitaire) * Number(l.quantite)).toLocaleString('fr-FR')} F
                    </span>
                    {lignes.length > 1 && (
                      <button onClick={() => removeLigne(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={addLigne} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4">
                <Plus size={14} /> Ajouter un produit
              </button>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-semibold text-gray-800">Total : {total.toLocaleString('fr-FR')} F</span>
                <div className="flex gap-2">
                  <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                  <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}