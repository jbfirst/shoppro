import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const fmt = (n) =>
  Number(n ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F";

const fmtShort = (n) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
  n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n ?? 0);

const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl text-sm">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name} : {typeof p.value === "number" && p.value > 1000 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const KpiCard = ({ label, value, sub, icon, color, trend }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 bg-gray-900 border border-gray-800 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold tracking-tight" style={{ color }}>{value}</p>
    <div className="flex items-center gap-2 text-xs">
      {trend !== undefined && (
        <span className={`font-semibold ${trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
      )}
      {sub && <span className="text-gray-500">{sub}</span>}
    </div>
    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
  </div>
);

export default function Rapports() {
  const [periode, setPeriode] = useState("30");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({});
  const [ventesParJour, setVentesParJour] = useState([]);
  const [ventesParCategorie, setVentesParCategorie] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [parPaiement, setParPaiement] = useState([]);
  const [ventesParMois, setVentesParMois] = useState([]);
  const [topClients, setTopClients] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const depuis = new Date();
    depuis.setDate(depuis.getDate() - parseInt(periode));
    const depuisISO = depuis.toISOString();
    const avantISO = new Date(depuis.getTime() - parseInt(periode) * 86400000).toISOString();

    try {
      const [
        { data: ventes },
        { data: ventesPrev },
        { data: clients },
        { data: paiements },
        { data: ventesAn },
      ] = await Promise.all([
        supabase.from("ventes").select("id, total, created_at, client_id, statut").gte("created_at", depuisISO).order("created_at", { ascending: true }),
        supabase.from("ventes").select("total").gte("created_at", avantISO).lt("created_at", depuisISO),
        supabase.from("clients").select("id, nom"),
        supabase.from("paiements").select("methode, montant").gte("created_at", depuisISO),
        supabase.from("ventes").select("total, created_at").gte("created_at", new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()),
      ]);

      // Détails ventes
      const ids = (ventes ?? []).map(v => v.id);
      let details = [];
      if (ids.length > 0) {
        const { data } = await supabase
          .from("ventes_details")
          .select("vente_id, produit_id, quantite, prix_unitaire, produits(nom, categorie)")
          .in("vente_id", ids);
        details = data ?? [];
      }

      // KPIs
      const totalCA = (ventes ?? []).reduce((s, v) => s + (v.total ?? 0), 0);
      const totalCAPrev = (ventesPrev ?? []).reduce((s, v) => s + (v.total ?? 0), 0);
      const nbCommandes = (ventes ?? []).length;
      const nbCommandesPrev = (ventesPrev ?? []).length;
      const panierMoyen = nbCommandes ? totalCA / nbCommandes : 0;
      const clientsUniques = new Set((ventes ?? []).map(v => v.client_id)).size;

      setKpis({
        ca: totalCA,
        caTrend: totalCAPrev ? Math.round(((totalCA - totalCAPrev) / totalCAPrev) * 100) : 0,
        commandes: nbCommandes,
        commandesTrend: nbCommandesPrev ? Math.round(((nbCommandes - nbCommandesPrev) / nbCommandesPrev) * 100) : 0,
        panier: panierMoyen,
        clients: clientsUniques,
      });

      // Ventes par jour
      const byDay = {};
      (ventes ?? []).forEach(v => {
        const day = v.created_at.slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + (v.total ?? 0);
      });
      setVentesParJour(
        Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b))
          .map(([date, total]) => ({ date: date.slice(5), total }))
      );

      // Ventes par mois
      const byMonth = {};
      (ventesAn ?? []).forEach(v => {
        const m = parseInt(v.created_at.slice(5, 7)) - 1;
        byMonth[m] = (byMonth[m] ?? 0) + (v.total ?? 0);
      });
      setVentesParMois(MONTHS_FR.map((name, i) => ({ name, total: byMonth[i] ?? 0 })));

      // Ventes par catégorie
      const byCat = {};
      details.forEach(d => {
        const cat = d.produits?.categorie ?? "Autres";
        byCat[cat] = (byCat[cat] ?? 0) + d.quantite * d.prix_unitaire;
      });
      setVentesParCategorie(Object.entries(byCat).map(([name, value]) => ({ name, value })));

      // Top produits
      const byProd = {};
      details.forEach(d => {
        const nom = d.produits?.nom ?? "Inconnu";
        if (!byProd[nom]) byProd[nom] = { nom, quantite: 0, ca: 0 };
        byProd[nom].quantite += d.quantite;
        byProd[nom].ca += d.quantite * d.prix_unitaire;
      });
      setTopProduits(Object.values(byProd).sort((a, b) => b.ca - a.ca).slice(0, 8));

      // Méthodes de paiement — depuis la table paiements
      const byPay = {};
      (paiements ?? []).forEach(p => {
        const m = p.methode ?? "Espèces";
        byPay[m] = (byPay[m] ?? 0) + (p.montant ?? 0);
      });
      setParPaiement(Object.entries(byPay).map(([name, value]) => ({ name, value })));

      // Top clients
      const byClient = {};
      (ventes ?? []).forEach(v => {
        const cid = v.client_id;
        if (!byClient[cid]) {
          const c = (clients ?? []).find(c => c.id === cid);
          byClient[cid] = { nom: c?.nom ?? "Anonyme", total: 0, commandes: 0 };
        }
        byClient[cid].total += v.total ?? 0;
        byClient[cid].commandes++;
      });
      setTopClients(Object.values(byClient).sort((a, b) => b.total - a.total).slice(0, 5));

    } catch (err) {
      console.error("Erreur chargement rapports:", err);
    }
    setLoading(false);
  }, [periode]);

  useEffect(() => { load(); }, [load]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text("ShopPro", 14, 18);
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(`Rapport - ${periode} derniers jours - Genere le ${new Date().toLocaleDateString("fr-FR")}`, 14, 26);

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Indicateurs cles", 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Chiffre d'affaires", fmt(kpis.ca)],
        ["Commandes", kpis.commandes],
        ["Panier moyen", fmt(kpis.panier)],
        ["Clients uniques", kpis.clients],
      ],
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.text("Top produits", 14, doc.lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Produit", "Quantite vendue", "CA genere"]],
      body: topProduits.map(p => [p.nom, p.quantite, fmt(p.ca)]),
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.text("Top clients", 14, doc.lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Client", "Commandes", "Total depense"]],
      body: topClients.map(c => [c.nom, c.commandes, fmt(c.total)]),
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(`rapport-shoppro-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-950">
        <Sidebar />
        <div className="ml-52 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Chargement des rapports…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 lg:p-8 overflow-auto">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rapports & Statistiques</h1>
            <p className="text-gray-400 text-sm mt-0.5">Vue d'ensemble de la performance de votre boutique</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
              {[{ label: "7j", value: "7" }, { label: "30j", value: "30" }, { label: "90j", value: "90" }, { label: "1an", value: "365" }].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPeriode(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    periode === opt.value ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter PDF
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Chiffre d'affaires" value={fmtShort(kpis.ca) + " F"} icon="💰" color="#6366f1" trend={kpis.caTrend} sub={`sur ${periode} jours`} />
          <KpiCard label="Commandes" value={kpis.commandes} icon="🛒" color="#22d3ee" trend={kpis.commandesTrend} sub="transactions" />
          <KpiCard label="Panier moyen" value={fmtShort(kpis.panier) + " F"} icon="🧾" color="#f59e0b" sub="par commande" />
          <KpiCard label="Clients actifs" value={kpis.clients} icon="👥" color="#10b981" sub="clients uniques" />
        </div>

        {/* Ligne 1 : Évolution CA + Camembert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-400">📈</span> Évolution du chiffre d'affaires
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ventesParJour} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={fmtShort} tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" name="CA" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradCA)" dot={false} activeDot={{ r: 5, fill: "#6366f1" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-amber-400">🥧</span> Par catégorie
            </h2>
            {ventesParCategorie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={ventesParCategorie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {ventesParCategorie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-2">
                  {ventesParCategorie.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-400 truncate max-w-[100px]">{c.name}</span>
                      </div>
                      <span className="text-gray-300 font-medium">{fmtShort(c.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Aucune donnée</div>
            )}
          </div>
        </div>

        {/* Ligne 2 : Top Produits + Méthodes paiement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400">🏆</span> Top produits (CA)
            </h2>
            {topProduits.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topProduits} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" tickFormatter={fmtShort} tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="nom" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ca" name="CA" radius={[0, 6, 6, 0]}>
                    {topProduits.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Aucune donnée</div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-cyan-400">💳</span> Revenus par paiement
            </h2>
            {parPaiement.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={parPaiement} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={fmtShort} tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Montant" radius={[6, 6, 0, 0]}>
                    {parPaiement.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Aucune donnée</div>
            )}
          </div>
        </div>

        {/* Ligne 3 : CA mensuel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-purple-400">📅</span> CA mensuel (12 derniers mois)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ventesParMois} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={fmtShort} tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="CA" radius={[6, 6, 0, 0]} fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ligne 4 : Top Clients */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-rose-400">⭐</span> Meilleurs clients
          </h2>
          {topClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-gray-800">
                    <th className="pb-3 font-medium pr-4">#</th>
                    <th className="pb-3 font-medium pr-4">Client</th>
                    <th className="pb-3 font-medium pr-4">Commandes</th>
                    <th className="pb-3 font-medium pr-4">Total dépensé</th>
                    <th className="pb-3 font-medium">Panier moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((c, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-gray-500/20 text-gray-400" : i === 2 ? "bg-orange-600/20 text-orange-400" : "bg-gray-800 text-gray-500"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white font-medium">{c.nom}</td>
                      <td className="py-3 pr-4 text-gray-300">{c.commandes}</td>
                      <td className="py-3 pr-4 text-indigo-400 font-semibold">{fmt(c.total)}</td>
                      <td className="py-3 text-gray-400">{fmt(c.total / c.commandes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-gray-600 text-sm">Aucun client dans cette période</div>
          )}
        </div>

      </main>
    </div>
  );
}