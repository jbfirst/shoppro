import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Produits from './pages/Produits'
import Ventes from './pages/Ventes'
import Clients from './pages/Clients'
import Stock from './pages/Stock'
import Parametres from './pages/Parametres'
import Paiements from './pages/Paiements'
import Rapports  from "./pages/Rapports";
import Accueil from "./pages/Accueil";


function ProtectedRoute({ children, session }) {
  if (session === null) return <Navigate to="/login" />
  if (session === undefined) return null // chargement
  return children
}

function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

 return (
  <BrowserRouter>
    <Routes>
      {/* Page publique */}
      <Route path="/" element={<Accueil />} />
      <Route path="/login" element={<Login />} />

      {/* Pages protégées */}
      <Route path="/dashboard"   element={<ProtectedRoute session={session}><Dashboard /></ProtectedRoute>} />
      <Route path="/produits"    element={<ProtectedRoute session={session}><Produits /></ProtectedRoute>} />
      <Route path="/ventes"      element={<ProtectedRoute session={session}><Ventes /></ProtectedRoute>} />
      <Route path="/clients"     element={<ProtectedRoute session={session}><Clients /></ProtectedRoute>} />
      <Route path="/stock"       element={<ProtectedRoute session={session}><Stock /></ProtectedRoute>} />
      <Route path="/paiements"   element={<ProtectedRoute session={session}><Paiements /></ProtectedRoute>} />
      <Route path="/rapports"    element={<ProtectedRoute session={session}><Rapports /></ProtectedRoute>} />
      <Route path="/parametres"  element={<ProtectedRoute session={session}><Parametres /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
)
}

export default App