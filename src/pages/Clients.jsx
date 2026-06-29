import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { Pencil, Trash2, X, Search } from 'lucide-react'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [filtres, setFiltres] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', adresse: '' })
  const [editId, setEditId] = useState(null)

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data || [])
    setFiltres(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  useEffect(() => {
    let result = clients
    if (search) result = result.filter(c =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.telephone?.includes(search)
    )
    setFiltres(result)
  }, [search, clients])

  const openModal = (client = null) => {
    if (client) {
      setForm({ nom: client.nom, email: client.email || '', telephone: client.telephone || '', adresse: client.adresse || '' })
      setEditId(client.id)
    } else {
      setForm({ nom: '', email: '', telephone: '', adresse: '' })
      setEditId(null)
    }
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditId(null) }

  const handleSubmit = async () => {
    if (!form.nom) return
    if (editId) {
      await supabase.from('clients').update(form).eq('id', editId)
    } else {
      await supabase.from('clients').insert([form])
    }
    closeModal()
    fetchClients()
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ?')) return
    await supabase.from('clients').delete().eq('id', id)
    fetchClients()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Clients" action={{ label: '+ Nouveau client', onClick: () => openModal() }} />

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
          <div className="ml-auto text-sm text-gray-400 flex items-center">
            {filtres.length} client(s)
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 mt-20">Chargement...</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Nom', 'Email', 'Téléphone', 'Adresse', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-normal px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtres.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{c.nom}</td>
                    <td className="px-6 py-4 text-gray-500">{c.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{c.telephone || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{c.adresse || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(c)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtres.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Aucun client trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">{editId ? 'Modifier client' : 'Nouveau client'}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3">
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Nom complet *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-5 justify-end">
                <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {editId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}