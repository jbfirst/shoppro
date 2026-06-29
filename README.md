# ShopPro — Dashboard de gestion de boutique

## 🚀 Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer Supabase
- Va sur https://supabase.com et crée un projet gratuit
- Dans ton projet Supabase : **Settings → API**
- Copie le `Project URL` et la `anon public key`
- Copie le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```
- Remplis les valeurs dans `.env`

### 3. Lancer le projet
```bash
npm run dev
```
Ouvre http://localhost:5173 dans ton navigateur.

## 📁 Structure du projet
```
src/
├── components/
│   ├── Sidebar.jsx     ← Navigation latérale
│   └── Topbar.jsx      ← Barre du haut
├── pages/
│   ├── Login.jsx       ← Page de connexion
│   ├── Dashboard.jsx   ← Tableau de bord principal
│   ├── Produits.jsx    ← Gestion des produits
│   ├── Ventes.jsx      ← Gestion des ventes
│   ├── Clients.jsx     ← Gestion des clients
│   └── Stock.jsx       ← Suivi du stock
├── lib/
│   └── supabase.js     ← Client Supabase
├── App.jsx             ← Routes de l'application
└── main.jsx            ← Point d'entrée
```

## 🛠️ Technologies utilisées
- **React 18** + **Vite** — frontend rapide
- **Tailwind CSS v4** — styles utilitaires
- **React Router v6** — navigation
- **Supabase** — base de données + authentification
- **Recharts** — graphiques
- **Lucide React** — icônes

## ✅ Étapes du projet
- [x] Étape 1 — Setup & structure (ce fichier)
- [ ] Étape 2 — Authentification + pages complètes
- [ ] Étape 3 — Déploiement sur Vercel
