import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { Pencil, Trash2, X, Search, ImagePlus, ZoomIn } from 'lucide-react'

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [filtres, setFiltres] = useState([])
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nom: '', description: '', prix: '', categorie: '' })
  const [editId, setEditId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imageZoom, setImageZoom] = useState(null)

  const fetchProduits = async () => {
    const { data } = await supabase.from('produits').select('*').order('created_at', { ascending: false })
    setProduits(data || [])
    setFiltres(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProduits() }, [])

  useEffect(() => {
    let result = produits
    if (search) result = result.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
    if (categorie) result = result.filter(p => p.categorie === categorie)
    setFiltres(result)
  }, [search, categorie, produits])

  const categories = [...new Set(produits.map(p => p.categorie).filter(Boolean))]

  const openModal = (produit = null) => {
    if (produit) {
      setForm({ nom: produit.nom, description: produit.description || '', prix: produit.prix, categorie: produit.categorie || '' })
      setEditId(produit.id)
      setImagePreview(produit.image_url || null)
    } else {
      setForm({ nom: '', description: '', prix: '', categorie: '' })
      setEditId(null)
      setImagePreview(null)
    }
    setImageFile(null)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEditId(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('produits-images')
      .upload(fileName, file, { upsert: true })
    if (error) { console.error(error); return null }
    const { data } = supabase.storage.from('produits-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.prix) return
    setUploading(true)

    let image_url = imagePreview && !imageFile ? imagePreview : null
    if (imageFile) image_url = await uploadImage(imageFile)

    const payload = { ...form, ...(image_url !== null ? { image_url } : {}) }

    if (editId) {
      await supabase.from('produits').update(payload).eq('id', editId)
    } else {
      const { data } = await supabase.from('produits').insert([payload]).select()
      if (data?.[0]) await supabase.from('stock').insert([{ produit_id: data[0].id, quantite: 0, seuil_alerte: 5 }])
    }

    setUploading(false)
    closeModal()
    fetchProduits()
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    fetchProduits()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Produits" action={{ label: '+ Nouveau produit', onClick: () => openModal() }} />

        {/* Recherche et filtres */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white text-gray-600"
            value={categorie}
            onChange={e => setCategorie(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 mt-20">Chargement...</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Image', 'Nom', 'Catégorie', 'Prix', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-normal px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtres.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">

                    {/* Image cliquable */}
                    <td className="px-6 py-3">
                      {p.image_url ? (
                        <div
                          className="relative group w-10 h-10 cursor-pointer"
                          onClick={() => setImageZoom(p)}
                        >
                          <img
                            src={p.image_url}
                            alt={p.nom}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 group-hover:brightness-75 transition-all"
                          />
                          <ZoomIn size={12} className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImagePlus size={14} className="text-gray-300" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-3 font-medium text-gray-800">{p.nom}</td>
                    <td className="px-6 py-3 text-gray-500">{p.categorie || '—'}</td>
                    <td className="px-6 py-3 text-gray-800">{Number(p.prix).toLocaleString('fr-FR')} F</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtres.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Aucun produit trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal ajout/modification */}
        {modal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">{editId ? 'Modifier produit' : 'Nouveau produit'}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>

              {/* Zone upload image */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">Image du produit</label>
                <div
                  className="relative border-2 border-dashed border-gray-200 rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                  onClick={() => document.getElementById('img-input').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImagePlus size={24} />
                      <span className="text-xs">Cliquer pour ajouter une image</span>
                    </div>
                  )}
                </div>
                <input id="img-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div className="flex flex-col gap-3">
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Nom du produit *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Catégorie" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} />
                <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Prix *" type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} />
                <textarea className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="flex gap-2 mt-5 justify-end">
                <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {uploading ? 'Envoi...' : editId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal zoom image */}
        {imageZoom && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
            onClick={() => setImageZoom(null)}
          >
            <div
              className="relative max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={imageZoom.image_url}
                alt={imageZoom.nom}
                className="w-full rounded-2xl shadow-2xl object-contain max-h-[75vh]"
              />
              {/* Infos produit en bas */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl px-5 py-4">
                <p className="text-white font-semibold text-base">{imageZoom.nom}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {imageZoom.categorie && (
                    <span className="text-white/70 text-sm">{imageZoom.categorie}</span>
                  )}
                  <span className="text-blue-300 text-sm font-medium">
                    {Number(imageZoom.prix).toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>
              {/* Bouton fermer */}
              <button
                onClick={() => setImageZoom(null)}
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}