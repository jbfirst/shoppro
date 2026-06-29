import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { Pencil, X, AlertTriangle } from 'lucide-react'

export default function Stock() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ quantite: '', seuil_alerte: '' })
  const [editId, setEditId] = useState(null)

  const fetchStock = async () => {
    const { data } = await supabase
      .from('stock')
      .select('*, produits(nom, categorie, prix)')
      .order('updated_at', { ascending: false })
    setStocks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchStock() }, [])

  const openModal = (stock) => {
    setForm({ quantite: stock.quantite, seuil_alerte: stock.seuil_alerte })
    setEditId(stock.id)
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditId(null) }

  const handleSubmit = async () => {
    await supabase.from('stock').update({
      quantite: Number(form.quantite),
      seuil_alerte: Number(form.seuil_alerte),
      updated_at: new Date().toISOString()
    }).eq('id', editId)
    closeModal()
    fetchStock()
  }

  const getStatut = (quantite, seuil) => {
    if (quantite === 0) return { label: 'Rupture', style: 'bg-red-50 text-red-600' }
    if (quantite <= seuil) return { label: 'Critique', style: 'bg-orange-50 text-orange-600' }
    return { label: 'OK', style: 'bg-green-50 text-green-700' }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Stock" />

        {stocks.filter(s => s.quantite <= s.seuil_alerte).length > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-sm px-4 py-3 rounded-xl mb-5">
            <AlertTriangle size={16} />
            <span>{stocks.filter(s => s.quantite <= s.seuil_alerte).length} produit(s) en stock critique ou en rupture</span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 mt-20">Chargement...</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Produit', 'Catégorie', 'Quantité', 'Seuil alerte', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-normal px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map(s => {
                  const statut = getStatut(s.quantite, s.seuil_alerte)
                  return (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{s.produits?.nom || '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{s.produits?.categorie || '—'}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{s.quantite}</td>
                      <td className="px-6 py-4 text-gray-500">{s.seuil_alerte}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statut.style}`}>
                          {statut.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openModal(s)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {stocks.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Aucun stock</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">Modifier le stock</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3">
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Quantité" type="number" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Seuil d'alerte" type="number" value={form.seuil_alerte} onChange={e => setForm({ ...form, seuil_alerte: e.target.value })} />
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