import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Accueil() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sp-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sp-animate").forEach((el) => {
      observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const features = [
    { icon: "ti-chart-bar",      title: "Analytics temps réel",   desc: "Ventes, marges, tendances — tout se met à jour instantanément." },
    { icon: "ti-package",        title: "Gestion de stock",        desc: "Alertes de rupture, photos produits, historique complet." },
    { icon: "ti-users",          title: "Base clients",            desc: "Contacts, historiques d'achats, fidélisation simplifiée." },
    { icon: "ti-device-mobile",  title: "Mobile money",            desc: "Flooz, Moov Money, Wave et plus — intégrés nativement." },
    { icon: "ti-file-export",    title: "Export PDF",              desc: "Rapports et factures professionnels en un seul clic." },
    { icon: "ti-bell",           title: "Notifications live",      desc: "Alertes instantanées pour chaque événement important." },
  ];

  const steps = [
    { num: "01", title: "Créez votre compte",     desc: "Inscription en 30 secondes, aucune carte bancaire requise." },
    { num: "02", title: "Ajoutez vos produits",   desc: "Importez votre catalogue, définissez vos prix et stocks." },
    { num: "03", title: "Gérez et analysez",      desc: "Suivez vos ventes en temps réel et prenez de meilleures décisions." },
  ];

  const stats = [
    { num: "4.8k+", label: "Transactions traitées" },
    { num: "98%",   label: "Disponibilité" },
    { num: "120+",  label: "Produits gérés" },
    { num: "5",     label: "Modes de paiement" },
  ];

  const barHeights = [35, 52, 78, 61, 69, 88, 64, 82, 94, 100, 75, 57];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sp-root {
          font-family: 'Inter', sans-serif;
          background: #060b17;
          color: #dde1eb;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── GRID BG ── */
        .sp-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }
        .sp-glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 500px;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAV ── */
        .sp-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 60px;
          background: rgba(6,11,23,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sp-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 19px;
          color: #fff;
          cursor: pointer;
          letter-spacing: -0.3px;
          user-select: none;
        }
        .sp-logo em { color: #3b82f6; font-style: normal; }
        .sp-nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .sp-nav-links a {
          font-size: 13.5px;
          color: rgba(221,225,235,0.5);
          text-decoration: none;
          transition: color 0.18s;
          font-weight: 400;
        }
        .sp-nav-links a:hover { color: #dde1eb; }
        .sp-nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 18px;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 13.5px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s;
        }
        .sp-nav-cta:hover { background: #2563eb; transform: translateY(-1px); }

        /* ── ANIMATIONS ── */
        .sp-animate {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .sp-animate.sp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .sp-animate-d1 { transition-delay: 0.1s; }
        .sp-animate-d2 { transition-delay: 0.2s; }
        .sp-animate-d3 { transition-delay: 0.3s; }
        .sp-animate-d4 { transition-delay: 0.4s; }

        /* ── HERO ── */
        .sp-hero {
          position: relative;
          z-index: 1;
          padding: 7rem 1.5rem 5rem;
          text-align: center;
          max-width: 820px;
          margin: 0 auto;
        }
        .sp-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.22);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 1.8rem;
          letter-spacing: 0.2px;
        }
        .sp-pill-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #60a5fa;
          animation: sp-blink 2s infinite;
        }
        @keyframes sp-blink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        .sp-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 6vw, 58px);
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: #fff;
          margin-bottom: 1.4rem;
        }
        .sp-h1 .blue { color: #3b82f6; }
        .sp-h1 .dim  { color: rgba(255,255,255,0.45); }
        .sp-hero-sub {
          font-size: 16.5px;
          color: rgba(221,225,235,0.5);
          line-height: 1.75;
          max-width: 480px;
          margin: 0 auto 2.8rem;
          font-weight: 300;
        }
        .sp-hero-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 4rem;
        }
        .sp-btn-p {
          display: flex; align-items: center; gap: 8px;
          padding: 13px 26px;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14.5px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .sp-btn-p:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.3);
        }
        .sp-btn-s {
          display: flex; align-items: center; gap: 8px;
          padding: 13px 26px;
          background: rgba(255,255,255,0.04);
          color: rgba(221,225,235,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          font-size: 14.5px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: border-color 0.18s, color 0.18s, transform 0.12s;
        }
        .sp-btn-s:hover {
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── DASHBOARD MOCKUP ── */
        .sp-mockup-wrap {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 0 1.5rem 4rem;
        }
        .sp-mockup-glow {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 120px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .sp-mockup {
          background: #0d1220;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .sp-mock-bar {
          background: #090e1a;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          gap: 7px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sp-dot { width: 10px; height: 10px; border-radius: 50%; }
        .sp-dot-r { background: #ff5f57; }
        .sp-dot-y { background: #febc2e; }
        .sp-dot-g { background: #28c840; }
        .sp-mock-url {
          margin-left: 10px;
          font-size: 11px;
          color: rgba(221,225,235,0.2);
          font-family: 'Inter', sans-serif;
        }
        .sp-mock-body { padding: 1.4rem; }
        .sp-mock-kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        .sp-kpi {
          background: #080d18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 9px;
          padding: 12px 14px;
        }
        .sp-kpi-l { font-size: 10px; color: rgba(221,225,235,0.35); margin-bottom: 5px; }
        .sp-kpi-v {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .sp-kpi-t { font-size: 10px; margin-top: 3px; }
        .sp-g { color: #4ade80; } .sp-r { color: #f87171; }
        .sp-mock-bottom {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 10px;
        }
        .sp-chart-box {
          background: #080d18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 9px;
          padding: 14px;
        }
        .sp-chart-label { font-size: 10px; color: rgba(221,225,235,0.3); margin-bottom: 10px; }
        .sp-bars {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 80px;
        }
        .sp-b {
          flex: 1;
          background: rgba(59,130,246,0.22);
          border-radius: 3px 3px 0 0;
          transition: background 0.2s;
        }
        .sp-b:hover { background: rgba(59,130,246,0.5); }
        .sp-b.hi { background: #3b82f6; }
        .sp-table-box {
          background: #080d18;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 9px;
          padding: 14px;
        }
        .sp-table-label { font-size: 10px; color: rgba(221,225,235,0.3); margin-bottom: 10px; }
        .sp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 11px;
        }
        .sp-row:last-child { border-bottom: none; }
        .sp-row-name { color: rgba(221,225,235,0.55); }
        .sp-badge-blue {
          background: rgba(59,130,246,0.15);
          color: #93c5fd;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
        }

        /* ── STATS BAR ── */
        .sp-stats {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          gap: 0;
          padding: 0 1.5rem;
          max-width: 860px;
          margin: 0 auto 5rem;
        }
        .sp-stat {
          flex: 1;
          text-align: center;
          padding: 2rem 1rem;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .sp-stat:first-child { border-radius: 12px 0 0 12px; }
        .sp-stat:last-child  { border-radius: 0 12px 12px 0; }
        .sp-stat + .sp-stat  { border-left: none; }
        .sp-stat-n {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .sp-stat-l { font-size: 12px; color: rgba(221,225,235,0.35); font-weight: 300; }

        /* ── FEATURES ── */
        .sp-feat-section {
          position: relative;
          z-index: 1;
          padding: 0 1.5rem 5rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .sp-section-eyebrow {
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2.5px;
          color: #3b82f6;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .sp-section-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          color: #fff;
          text-align: center;
          letter-spacing: -0.5px;
          margin-bottom: 0.6rem;
        }
        .sp-section-sub {
          text-align: center;
          font-size: 14px;
          color: rgba(221,225,235,0.4);
          margin-bottom: 3rem;
          font-weight: 300;
        }
        .sp-feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .sp-fc {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.4rem;
          transition: border-color 0.2s, transform 0.2s, background 0.2s;
        }
        .sp-fc:hover {
          border-color: rgba(59,130,246,0.3);
          background: rgba(59,130,246,0.04);
          transform: translateY(-3px);
        }
        .sp-fc-icon {
          width: 38px; height: 38px;
          border-radius: 9px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          color: #60a5fa;
          margin-bottom: 1rem;
        }
        .sp-fc-title {
          font-family: 'Syne', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #e8eaf0;
          margin-bottom: 6px;
        }
        .sp-fc-desc { font-size: 12.5px; color: rgba(221,225,235,0.38); line-height: 1.65; font-weight: 300; }

        /* ── HOW IT WORKS ── */
        .sp-steps-section {
          position: relative;
          z-index: 1;
          padding: 0 1.5rem 5rem;
          max-width: 860px;
          margin: 0 auto;
        }
        .sp-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          position: relative;
        }
        .sp-step {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 2rem 1.4rem;
          position: relative;
          overflow: hidden;
        }
        .sp-step::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .sp-step:hover::before { opacity: 1; }
        .sp-step-num {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: rgba(59,130,246,0.15);
          line-height: 1;
          margin-bottom: 1rem;
        }
        .sp-step-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #e8eaf0;
          margin-bottom: 8px;
        }
        .sp-step-desc { font-size: 12.5px; color: rgba(221,225,235,0.38); line-height: 1.65; font-weight: 300; }

        /* ── CTA SECTION ── */
        .sp-cta-section {
          position: relative;
          z-index: 1;
          padding: 0 1.5rem 6rem;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .sp-cta-box {
          background: rgba(59,130,246,0.07);
          border: 1px solid rgba(59,130,246,0.18);
          border-radius: 20px;
          padding: 3.5rem 2rem;
        }
        .sp-cta-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.8px;
          margin-bottom: 1rem;
        }
        .sp-cta-p {
          font-size: 14.5px;
          color: rgba(221,225,235,0.45);
          margin-bottom: 2rem;
          font-weight: 300;
          line-height: 1.7;
        }

        /* ── FOOTER ── */
        .sp-footer {
          position: relative;
          z-index: 1;
          padding: 1.8rem 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .sp-footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: rgba(255,255,255,0.5);
        }
        .sp-footer-logo em { color: #3b82f6; font-style: normal; }
        .sp-footer-copy { font-size: 12px; color: rgba(221,225,235,0.25); font-weight: 300; }
        .sp-footer-tech { font-size: 12px; color: rgba(221,225,235,0.2); font-weight: 300; }

        @media (max-width: 640px) {
          .sp-nav-links { display: none; }
          .sp-mock-kpis { grid-template-columns: repeat(2, 1fr); }
          .sp-mock-bottom { grid-template-columns: 1fr; }
          .sp-feat-grid { grid-template-columns: 1fr 1fr; }
          .sp-steps-grid { grid-template-columns: 1fr; }
          .sp-stats { flex-wrap: wrap; }
          .sp-stat { border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.06); }
          .sp-footer { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-grid-bg" />
        <div className="sp-glow" />

        {/* NAV */}
        <nav className="sp-nav">
          <div className="sp-logo" onClick={() => navigate("/")}>Shop<em>Pro</em></div>
          <ul className="sp-nav-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/produits">Produits</a></li>
            <li><a href="/ventes">Ventes</a></li>
            <li><a href="/clients">Clients</a></li>
          </ul>
          <button className="sp-nav-cta" onClick={() => navigate("/login")}>
            <i className="ti ti-login" aria-hidden="true" />
            Se connecter
          </button>
        </nav>

        {/* HERO */}
        <section className="sp-hero">
          <div className="sp-pill sp-animate">
            <div className="sp-pill-dot" />
            Nouvelle version — ShopPro v2.0
          </div>
          <h1 className="sp-h1 sp-animate sp-animate-d1">
            Gérez votre boutique<br />
            <span className="blue">avec intelligence</span>
          </h1>
          <p className="sp-hero-sub sp-animate sp-animate-d2">
            Le tableau de bord conçu pour les commerçants d'Afrique francophone. Ventes, stock, clients et paiements — tout au même endroit.
          </p>
          <div className="sp-hero-btns sp-animate sp-animate-d3">
            <button className="sp-btn-p" onClick={() => navigate("/login")}>
              <i className="ti ti-rocket" aria-hidden="true" />
              Commencer gratuitement
            </button>
            <button className="sp-btn-s" onClick={() => navigate("/dashboard")}>
              <i className="ti ti-eye" aria-hidden="true" />
              Voir le dashboard
            </button>
          </div>
        </section>

        {/* MOCKUP */}
        <div className="sp-mockup-wrap sp-animate">
          <div className="sp-mockup">
            <div className="sp-mock-bar">
              <div className="sp-dot sp-dot-r" />
              <div className="sp-dot sp-dot-y" />
              <div className="sp-dot sp-dot-g" />
              <span className="sp-mock-url">shoppro.app · Tableau de bord</span>
            </div>
            <div className="sp-mock-body">
              <div className="sp-mock-kpis">
                {[
                  { l: "Ventes du jour", v: "247 500 F", t: "↑ +12%", g: true },
                  { l: "Commandes",      v: "38",        t: "↑ +5",   g: true },
                  { l: "Stock faible",   v: "4 articles",t: "↓ alerte",g: false },
                  { l: "Clients actifs", v: "182",       t: "↑ +3",   g: true },
                ].map((k) => (
                  <div className="sp-kpi" key={k.l}>
                    <div className="sp-kpi-l">{k.l}</div>
                    <div className="sp-kpi-v">{k.v}</div>
                    <div className={`sp-kpi-t ${k.g ? "sp-g" : "sp-r"}`}>{k.t}</div>
                  </div>
                ))}
              </div>
              <div className="sp-mock-bottom">
                <div className="sp-chart-box">
                  <div className="sp-chart-label">Évolution des ventes — 12 derniers jours</div>
                  <div className="sp-bars">
                    {barHeights.map((h, i) => (
                      <div key={i} className={`sp-b${i === 9 ? " hi" : ""}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="sp-table-box">
                  <div className="sp-table-label">Ventes récentes</div>
                  {[
                    { n: "Huile palme 5L",  a: "3 500 F" },
                    { n: "Riz local 10kg",  a: "8 200 F" },
                    { n: "Savon Nana x12",  a: "4 800 F" },
                    { n: "Lait Fanta 1L",   a: "1 200 F" },
                  ].map((r) => (
                    <div className="sp-row" key={r.n}>
                      <span className="sp-row-name">{r.n}</span>
                      <span className="sp-badge-blue">{r.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="sp-mockup-glow" />
        </div>

        {/* STATS */}
        <div className="sp-stats sp-animate">
          {stats.map((s) => (
            <div className="sp-stat" key={s.label}>
              <div className="sp-stat-n">{s.num}</div>
              <div className="sp-stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="sp-feat-section">
          <div className="sp-section-eyebrow sp-animate">Fonctionnalités</div>
          <h2 className="sp-section-h2 sp-animate sp-animate-d1">Tout ce dont vous avez besoin</h2>
          <p className="sp-section-sub sp-animate sp-animate-d2">Un outil complet, pensé pour la réalité du commerce en Afrique.</p>
          <div className="sp-feat-grid">
            {features.map((f, i) => (
              <div className={`sp-fc sp-animate sp-animate-d${(i % 3) + 1}`} key={f.title}>
                <div className="sp-fc-icon">
                  <i className={`ti ${f.icon}`} aria-hidden="true" />
                </div>
                <div className="sp-fc-title">{f.title}</div>
                <div className="sp-fc-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sp-steps-section">
          <div className="sp-section-eyebrow sp-animate">Comment ça marche</div>
          <h2 className="sp-section-h2 sp-animate sp-animate-d1">Démarrez en 3 étapes</h2>
          <p className="sp-section-sub sp-animate sp-animate-d2">Simple, rapide, efficace.</p>
          <div className="sp-steps-grid">
            {steps.map((s, i) => (
              <div className={`sp-step sp-animate sp-animate-d${i + 1}`} key={s.num}>
                <div className="sp-step-num">{s.num}</div>
                <div className="sp-step-title">{s.title}</div>
                <div className="sp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="sp-cta-section">
          <div className="sp-cta-box sp-animate">
            <h2 className="sp-cta-h2">Prêt à booster vos ventes ?</h2>
            <p className="sp-cta-p">
              Rejoignez les commerçants qui pilotent leur activité avec ShopPro.<br />
              Accès immédiat, sans engagement.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="sp-btn-p" onClick={() => navigate("/login")}>
                <i className="ti ti-rocket" aria-hidden="true" />
                Créer mon compte
              </button>
              <button className="sp-btn-s" onClick={() => navigate("/dashboard")}>
                <i className="ti ti-layout-dashboard" aria-hidden="true" />
                Explorer le dashboard
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sp-footer">
          <div className="sp-footer-logo">Shop<em>Pro</em></div>
          <span className="sp-footer-copy">© 2025 TOXIMA · Tous droits réservés</span>
          <span className="sp-footer-tech">React · Vite · Supabase · Tailwind</span>
        </footer>
      </div>
    </>
  );
}