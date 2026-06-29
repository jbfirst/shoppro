import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { User, Lock, Store, Check } from 'lucide-react'

export default function Parametres() {
  const [tab, setTab] = useState('profil')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [profil, setProfil] = useState({ email: '', nom: '' })
  const [mdp, setMdp] = useState({ nouveau: '', confirmation: '' })
  const [boutique, setBoutique] = useState({ nom: 'ShopPro', devise: 'F CFA', adresse: '' })

  useEffect(() => {
    const fetchProfil = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setProfil({ email: user.email, nom: user.user_metadata?.nom || '' })
    }
    fetchProfil()
  }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setError('')
    setTimeout(() => setSuccess(''), 3000)
  }

  const showError = (msg) => {
    setError(msg)
    setSuccess('')
    setTimeout(() => setError(''), 3000)
  }

  const handleProfil = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      email: profil.email,
      data: { nom: profil.nom }
    })
    setLoading(false)
    if (error) showError(error.message)
    else showSuccess('Profil mis à jour avec succès !')
  }

  const handleMdp = async () => {
    if (mdp.nouveau !== mdp.confirmation) return showError('Les mots de passe ne correspondent pas')
    if (mdp.nouveau.length < 6) return showError('Le mot de passe doit contenir au moins 6 caractères')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: mdp.nouveau })
    setLoading(false)
    if (error) showError(error.message)
    else {
      showSuccess('Mot de passe modifié avec succès !')
      setMdp({ nouveau: '', confirmation: '' })
    }
  }

  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'boutique', label: 'Boutique', icon: Store },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 p-8">
        <Topbar title="Paramètres" />

        {/* Alertes */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-xl mb-5">
            <Check size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            ⚠️ {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Tabs */}
          <div className="w-48 flex flex-col gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  tab === id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 max-w-lg">

            {/* Profil */}
            {tab === 'profil' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-5">Informations du profil</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nom complet</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="Votre nom"
                      value={profil.nom}
                      onChange={e => setProfil({ ...profil, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="votre@email.com"
                      value={profil.email}
                      onChange={e => setProfil({ ...profil, email: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleProfil}
                    disabled={loading}
                    className="self-start px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {/* Sécurité */}
            {tab === 'securite' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-5">Changer le mot de passe</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="••••••••"
                      value={mdp.nouveau}
                      onChange={e => setMdp({ ...mdp, nouveau: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="••••••••"
                      value={mdp.confirmation}
                      onChange={e => setMdp({ ...mdp, confirmation: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleMdp}
                    disabled={loading}
                    className="self-start px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Modification...' : 'Modifier le mot de passe'}
                  </button>
                </div>
              </div>
            )}

            {/* Boutique */}
            {tab === 'boutique' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-5">Informations de la boutique</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nom de la boutique</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      value={boutique.nom}
                      onChange={e => setBoutique({ ...boutique, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Devise</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                      value={boutique.devise}
                      onChange={e => setBoutique({ ...boutique, devise: e.target.value })}
                    >
                      <option value="F CFA">F CFA</option>
                      <option value="EUR">EUR €</option>
                      <option value="USD">USD $</option>
                      <option value="GHS">GHS ₵</option>
                      <option value="NGN">NGN ₦</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                      rows={3}
                      placeholder="Adresse de la boutique"
                      value={boutique.adresse}
                      onChange={e => setBoutique({ ...boutique, adresse: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => showSuccess('Paramètres boutique enregistrés !')}
                    className="self-start px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}