import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Accueil() {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sp-visible");
            observerRef.current.unobserve(entry.target); // ✅ FIX: unobserve après animation
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

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && !e.target.closest(".sp-nav")) setMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

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
    { num: "12k+",  label: "Transactions traitées" },
    { num: "98%",   label: "Disponibilité" },
    { num: "850+",  label: "Produits gérés" },
    { num: "5",     label: "Modes de paiement" },
  ];

  // ✅ Témoignages avec vraies photos Unsplash
  const testimonials = [
    {
      name: "Adjoavi Mensah",
      role: "Commerçante — Lomé, Togo",
      photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
      avatar: "AM",
      color: "#3b82f6",
      text: "Avant ShopPro, je gérais tout dans un cahier. Maintenant je vois mes ventes en temps réel depuis mon téléphone. En un mois j'ai réduit mes ruptures de stock de moitié.",
      flag: "🇹🇬",
    },
    {
      name: "Kofi Asante",
      role: "Gérant épicerie — Abidjan, Côte d'Ivoire",
      photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face",
      avatar: "KA",
      color: "#10b981",
      text: "Le paiement Flooz et Wave directement intégré, c'est ce qui m'a convaincu. Mes clients paient sans problème et je vois chaque transaction instantanément.",
      flag: "🇨🇮",
    },
    {
      name: "Fatou Diallo",
      role: "Boutique vêtements — Dakar, Sénégal",
      photo: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=80&h=80&fit=crop&crop=face",
      avatar: "FD",
      color: "#f59e0b",
      text: "Les rapports PDF m'ont sauvé la mise pour ma comptabilité de fin d'année. Mon comptable était impressionné par la précision des données.",
      flag: "🇸🇳",
    },
  ];

  // ✅ NOUVEAU : Plans tarifs
  const plans = [
    {
      name: "Gratuit",
      price: "0 F",
      period: "pour toujours",
      desc: "Parfait pour démarrer",
      features: [
        "Jusqu'à 50 produits",
        "50 ventes / mois",
        "1 utilisateur",
        "Export PDF basique",
        "Support communauté",
      ],
      cta: "Commencer gratuitement",
      highlight: false,
    },
    {
      name: "Pro",
      price: "9 900 F",
      period: "/ mois",
      desc: "Pour les boutiques actives",
      features: [
        "Produits illimités",
        "Ventes illimitées",
        "3 utilisateurs",
        "Mobile money intégré",
        "Analytics avancés",
        "Support prioritaire",
      ],
      cta: "Essayer 14 jours gratuits",
      highlight: true,
    },
    {
      name: "Business",
      price: "24 900 F",
      period: "/ mois",
      desc: "Multi-boutiques et équipes",
      features: [
        "Tout du plan Pro",
        "Utilisateurs illimités",
        "Multi-boutiques",
        "API personnalisée",
        "Account manager dédié",
      ],
      cta: "Contacter l'équipe",
      highlight: false,
    },
  ];

  // Images produits pour le mockup dashboard (Unsplash)
  const mockProducts = [
    { n: "Huile palme 5L",  a: "3 500 F", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=32&h=32&fit=crop" },
    { n: "Riz local 10kg",  a: "8 200 F", img: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=32&h=32&fit=crop" },
    { n: "Savon Nana x12",  a: "4 800 F", img: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=32&h=32&fit=crop" },
    { n: "Lait Fanta 1L",   a: "1 200 F", img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=32&h=32&fit=crop" },
  ];

  // Image hero section (marché africain)
  const heroImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=500&fit=crop&crop=center";

  const barHeights = [35, 52, 78, 61, 69, 88, 64, 82, 94, 100, 75, 57];

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/produits",  label: "Produits" },
    { to: "/ventes",    label: "Ventes" },
    { to: "/clients",   label: "Clients" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sp-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #060b17;
          color: #dde1eb;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── GRID BG ── */
        .sp-grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }
        .sp-glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── NAV ── */
        .sp-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 60px;
          background: rgba(6,11,23,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sp-logo {
          font-family: 'Syne', system-ui, sans-serif; font-weight: 800; font-size: 19px;
          color: #fff; cursor: pointer; letter-spacing: -0.3px; user-select: none;
          text-decoration: none;
        }
        .sp-logo em { color: #3b82f6; font-style: normal; }

        /* ✅ FIX: nav links utilisent <Link> */
        .sp-nav-links {
          display: flex; gap: 2rem; list-style: none;
        }
        .sp-nav-links a {
          font-size: 13.5px; color: rgba(221,225,235,0.55);
          text-decoration: none; transition: color 0.18s; font-weight: 400;
        }
        .sp-nav-links a:hover { color: #dde1eb; }

        .sp-nav-cta {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 18px; background: #3b82f6; color: #fff;
          border: none; border-radius: 7px; font-size: 13.5px;
          font-family: 'Inter', system-ui, sans-serif; font-weight: 500;
          cursor: pointer; transition: background 0.18s, transform 0.12s;
          text-decoration: none;
        }
        .sp-nav-cta:hover { background: #2563eb; transform: translateY(-1px); }

        /* ✅ NOUVEAU : Burger menu */
        .sp-burger {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 7px;
          color: #dde1eb;
          padding: 6px 9px;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        }
        .sp-mobile-menu {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 60px; left: 0; right: 0;
          background: rgba(6,11,23,0.98);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 1rem 2rem 1.5rem;
          gap: 1.2rem;
        }
        .sp-mobile-menu.open { display: flex; }
        .sp-mobile-menu a {
          color: rgba(221,225,235,0.65); text-decoration: none;
          font-size: 15px; font-weight: 400;
          padding: .4rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.15s;
        }
        .sp-mobile-menu a:last-child { border-bottom: none; }
        .sp-mobile-menu a:hover { color: #fff; }
        .sp-mobile-cta {
          margin-top: .5rem;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px; background: #3b82f6; color: #fff;
          border-radius: 8px; font-size: 14px; font-weight: 500;
          text-decoration: none; cursor: pointer;
          border: none; font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── ANIMATIONS ── */
        .sp-animate {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .sp-animate.sp-visible { opacity: 1; transform: translateY(0); }
        .sp-animate-d1 { transition-delay: 0.1s; }
        .sp-animate-d2 { transition-delay: 0.2s; }
        .sp-animate-d3 { transition-delay: 0.3s; }
        .sp-animate-d4 { transition-delay: 0.4s; }

        /* ── HERO ── */
        .sp-hero {
          position: relative; z-index: 1;
          padding: 7rem 1.5rem 5rem;
          text-align: center; max-width: 820px; margin: 0 auto;
        }
        .sp-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.22);
          color: #93c5fd; font-size: 12px; font-weight: 500;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 1.8rem; letter-spacing: 0.2px;
        }
        .sp-pill-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #60a5fa;
          animation: sp-blink 2s infinite;
        }
        @keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .sp-h1 {
          font-family: 'Syne', system-ui, sans-serif; font-weight: 800;
          font-size: clamp(36px, 6vw, 58px); line-height: 1.08;
          letter-spacing: -1.5px; color: #fff; margin-bottom: 1.4rem;
        }
        .sp-h1 .blue { color: #3b82f6; }
        .sp-hero-sub {
          font-size: 16.5px; color: rgba(221,225,235,0.6);
          line-height: 1.75; max-width: 480px; margin: 0 auto 1rem; font-weight: 300;
        }
        .sp-hero-flags {
          font-size: 22px; letter-spacing: 4px; margin-bottom: 2.2rem;
          opacity: 0.75;
        }
        .sp-hero-btns {
          display: flex; gap: 12px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 4rem;
        }
        .sp-btn-p {
          display: flex; align-items: center; gap: 8px;
          padding: 13px 26px; background: #3b82f6; color: #fff;
          border: none; border-radius: 9px; font-size: 14.5px;
          font-family: 'Inter', system-ui, sans-serif; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
        }
        .sp-btn-p:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
        .sp-btn-s {
          display: flex; align-items: center; gap: 8px;
          padding: 13px 26px; background: rgba(255,255,255,0.04);
          color: rgba(221,225,235,0.75); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px; font-size: 14.5px;
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer; text-decoration: none;
          transition: border-color 0.18s, color 0.18s, transform 0.12s;
        }
        .sp-btn-s:hover { border-color: rgba(255,255,255,0.28); color: #fff; transform: translateY(-2px); }

        /* ── MOCKUP ── */
        .sp-mockup-wrap {
          position: relative; z-index: 1;
          max-width: 860px; margin: 0 auto; padding: 0 1.5rem 4rem;
        }
        .sp-mockup-glow {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 80%; height: 120px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .sp-mockup {
          background: #0d1220; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .sp-mock-bar {
          background: #090e1a; padding: 11px 16px;
          display: flex; align-items: center; gap: 7px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sp-dot { width: 10px; height: 10px; border-radius: 50%; }
        .sp-dot-r { background: #ff5f57; }
        .sp-dot-y { background: #febc2e; }
        .sp-dot-g { background: #28c840; }
        .sp-mock-url { margin-left: 10px; font-size: 11px; color: rgba(221,225,235,0.2); }
        .sp-mock-body { padding: 1.4rem; }
        .sp-mock-kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 12px; }
        .sp-kpi {
          background: #080d18; border: 1px solid rgba(255,255,255,0.05);
          border-radius: 9px; padding: 12px 14px;
        }
        .sp-kpi-l { font-size: 10px; color: rgba(221,225,235,0.4); margin-bottom: 5px; }
        .sp-kpi-v { font-family: 'Syne', system-ui, sans-serif; font-size: 20px; font-weight: 700; color: #fff; }
        .sp-kpi-t { font-size: 10px; margin-top: 3px; }
        .sp-g { color: #4ade80; } .sp-r { color: #f87171; }
        .sp-mock-bottom { display: grid; grid-template-columns: 3fr 2fr; gap: 10px; }
        .sp-chart-box, .sp-table-box {
          background: #080d18; border: 1px solid rgba(255,255,255,0.05);
          border-radius: 9px; padding: 14px;
        }
        .sp-chart-label, .sp-table-label { font-size: 10px; color: rgba(221,225,235,0.35); margin-bottom: 10px; }
        .sp-bars { display: flex; align-items: flex-end; gap: 4px; height: 80px; }
        .sp-b { flex: 1; background: rgba(59,130,246,0.22); border-radius: 3px 3px 0 0; }
        .sp-b:hover { background: rgba(59,130,246,0.5); }
        .sp-b.hi { background: #3b82f6; }
        .sp-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 11px;
        }
        .sp-row:last-child { border-bottom: none; }
        .sp-row-name { color: rgba(221,225,235,0.6); }
        .sp-badge-blue {
          background: rgba(59,130,246,0.15); color: #93c5fd;
          padding: 2px 8px; border-radius: 4px; font-size: 10px;
        }

        /* ── STATS ── */
        .sp-stats {
          position: relative; z-index: 1;
          display: flex; justify-content: center;
          padding: 0 1.5rem; max-width: 860px; margin: 0 auto 5rem;
        }
        .sp-stat {
          flex: 1; text-align: center; padding: 2rem 1rem;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }
        .sp-stat:first-child { border-radius: 12px 0 0 12px; }
        .sp-stat:last-child  { border-radius: 0 12px 12px 0; }
        .sp-stat + .sp-stat  { border-left: none; }
        .sp-stat-n { font-family: 'Syne', system-ui, sans-serif; font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .sp-stat-l { font-size: 12px; color: rgba(221,225,235,0.45); font-weight: 300; }

        /* ── SECTION HEADERS ── */
        .sp-section-eyebrow {
          text-align: center; font-size: 11px; font-weight: 500;
          letter-spacing: 2.5px; color: #3b82f6; text-transform: uppercase; margin-bottom: 10px;
        }
        .sp-section-h2 {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: clamp(24px, 3vw, 32px); font-weight: 700;
          color: #fff; text-align: center; letter-spacing: -0.5px; margin-bottom: 0.6rem;
        }
        .sp-section-sub {
          text-align: center; font-size: 14px;
          color: rgba(221,225,235,0.5); margin-bottom: 3rem; font-weight: 300;
        }

        /* ── FEATURES ── */
        .sp-feat-section {
          position: relative; z-index: 1;
          padding: 0 1.5rem 5rem; max-width: 900px; margin: 0 auto;
        }
        .sp-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .sp-fc {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 1.4rem;
          transition: border-color 0.2s, transform 0.2s, background 0.2s;
        }
        .sp-fc:hover { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.04); transform: translateY(-3px); }
        .sp-fc-icon {
          width: 38px; height: 38px; border-radius: 9px;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #60a5fa; margin-bottom: 1rem;
        }
        .sp-fc-title { font-family: 'Syne', system-ui, sans-serif; font-size: 13.5px; font-weight: 700; color: #e8eaf0; margin-bottom: 6px; }
        .sp-fc-desc { font-size: 12.5px; color: rgba(221,225,235,0.5); line-height: 1.65; font-weight: 300; }

        /* ── HOW IT WORKS ── */
        .sp-steps-section {
          position: relative; z-index: 1;
          padding: 0 1.5rem 5rem; max-width: 860px; margin: 0 auto;
        }
        .sp-steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .sp-step {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 2rem 1.4rem; position: relative; overflow: hidden;
        }
        .sp-step::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa); opacity: 0; transition: opacity 0.2s;
        }
        .sp-step:hover::before { opacity: 1; }
        .sp-step-num { font-family: 'Syne', system-ui, sans-serif; font-size: 36px; font-weight: 800; color: rgba(59,130,246,0.2); line-height: 1; margin-bottom: 1rem; }
        .sp-step-title { font-family: 'Syne', system-ui, sans-serif; font-size: 14px; font-weight: 700; color: #e8eaf0; margin-bottom: 8px; }
        .sp-step-desc { font-size: 12.5px; color: rgba(221,225,235,0.5); line-height: 1.65; font-weight: 300; }

        /* ✅ NOUVEAU : TÉMOIGNAGES ── */
        .sp-testi-section {
          position: relative; z-index: 1;
          padding: 0 1.5rem 5rem; max-width: 900px; margin: 0 auto;
        }
        .sp-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .sp-testi-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.5rem;
          display: flex; flex-direction: column; gap: 1.1rem;
        }
        .sp-testi-stars { color: #f59e0b; font-size: 13px; letter-spacing: 2px; }
        .sp-testi-text {
          font-size: 13px; color: rgba(221,225,235,0.65);
          line-height: 1.75; font-weight: 300; font-style: italic; flex: 1;
        }
        .sp-testi-author { display: flex; align-items: center; gap: 10px; margin-top: auto; }
        .sp-testi-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .sp-testi-name { font-size: 12.5px; font-weight: 500; color: #e8eaf0; }
        .sp-testi-role { font-size: 11px; color: rgba(221,225,235,0.4); margin-top: 1px; }
        .sp-testi-flag { font-size: 16px; margin-left: auto; }

        /* ✅ NOUVEAU : PRICING ── */
        .sp-pricing-section {
          position: relative; z-index: 1;
          padding: 0 1.5rem 5rem; max-width: 960px; margin: 0 auto;
        }
        .sp-pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; align-items: start; }
        .sp-plan {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.8rem 1.5rem;
          display: flex; flex-direction: column; gap: .9rem;
          transition: transform 0.2s;
        }
        .sp-plan:hover { transform: translateY(-3px); }
        .sp-plan.highlighted {
          background: rgba(59,130,246,0.07); border-color: rgba(59,130,246,0.35);
          position: relative;
        }
        .sp-plan-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #3b82f6; color: #fff;
          font-size: 11px; font-weight: 600; padding: 3px 14px;
          border-radius: 999px; white-space: nowrap; letter-spacing: 0.3px;
        }
        .sp-plan-name { font-size: 13px; font-weight: 500; color: rgba(221,225,235,0.55); letter-spacing: 0.5px; }
        .sp-plan-price-row { display: flex; align-items: baseline; gap: 4px; }
        .sp-plan-price {
          font-family: 'Syne', system-ui, sans-serif; font-size: 30px;
          font-weight: 800; color: #fff; letter-spacing: -1px;
        }
        .sp-plan-period { font-size: 12px; color: rgba(221,225,235,0.4); }
        .sp-plan-desc { font-size: 12.5px; color: rgba(221,225,235,0.45); }
        .sp-plan-divider { height: 1px; background: rgba(255,255,255,0.06); }
        .sp-plan-features { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .sp-plan-feat {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; color: rgba(221,225,235,0.65);
        }
        .sp-plan-feat i { color: #4ade80; font-size: 14px; flex-shrink: 0; }
        .sp-plan-cta {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 20px; border-radius: 9px; font-size: 13.5px; font-weight: 500;
          cursor: pointer; text-decoration: none; border: none;
          font-family: 'Inter', system-ui, sans-serif;
          transition: background 0.18s, transform 0.12s;
          margin-top: .5rem;
        }
        .sp-plan-cta.primary { background: #3b82f6; color: #fff; }
        .sp-plan-cta.primary:hover { background: #2563eb; transform: translateY(-1px); }
        .sp-plan-cta.secondary {
          background: rgba(255,255,255,0.04); color: rgba(221,225,235,0.7);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .sp-plan-cta.secondary:hover { border-color: rgba(255,255,255,0.22); color: #fff; }

        /* ── CTA FINAL ── */
        .sp-cta-section {
          position: relative; z-index: 1;
          padding: 0 1.5rem 6rem; max-width: 700px; margin: 0 auto; text-align: center;
        }
        .sp-cta-box {
          background: rgba(59,130,246,0.07); border: 1px solid rgba(59,130,246,0.18);
          border-radius: 20px; padding: 3.5rem 2rem;
        }
        .sp-cta-h2 {
          font-family: 'Syne', system-ui, sans-serif; font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800; color: #fff; letter-spacing: -0.8px; margin-bottom: 1rem;
        }
        .sp-cta-p {
          font-size: 14.5px; color: rgba(221,225,235,0.5);
          margin-bottom: 2rem; font-weight: 300; line-height: 1.7;
        }

        /* ── FOOTER ── */
        .sp-footer {
          position: relative; z-index: 1; padding: 1.8rem 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .sp-footer-logo { font-family: 'Syne', system-ui, sans-serif; font-weight: 800; font-size: 15px; color: rgba(255,255,255,0.5); text-decoration: none; }
        .sp-footer-logo em { color: #3b82f6; font-style: normal; }
        .sp-footer-copy { font-size: 12px; color: rgba(221,225,235,0.28); font-weight: 300; }
        .sp-footer-tech { font-size: 12px; color: rgba(221,225,235,0.22); font-weight: 300; }

        /* ── HERO IMAGE ── */
        .sp-hero-img-wrap {
          position: relative; z-index: 1;
          max-width: 860px; margin: -2rem auto 0; padding: 0 1.5rem 3rem;
        }
        .sp-hero-img {
          width: 100%; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 80px rgba(0,0,0,0.55);
          position: relative;
        }
        .sp-hero-img img {
          width: 100%; height: 320px; object-fit: cover; display: block;
          filter: brightness(0.75) saturate(0.9);
        }
        .sp-hero-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(6,11,23,0.1) 0%, rgba(6,11,23,0.7) 100%);
        }
        .sp-hero-img-caption {
          position: absolute; bottom: 1.2rem; left: 1.5rem; right: 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .sp-hero-img-tag {
          background: rgba(6,11,23,0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(221,225,235,0.8); font-size: 12px;
          padding: 5px 12px; border-radius: 999px;
          display: flex; align-items: center; gap: 6px;
        }
        .sp-hero-img-tag i { color: #60a5fa; font-size: 13px; }

        /* ── PRODUIT IMG DANS MOCKUP ── */
        .sp-row-img {
          width: 28px; height: 28px; border-radius: 5px; object-fit: cover;
          flex-shrink: 0; border: 1px solid rgba(255,255,255,0.07);
        }
        .sp-row { gap: 8px; }

        /* ── AVATAR PHOTO ── */
        .sp-testi-avatar img {
          width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
        }
        .sp-testi-avatar {
          border: 2px solid rgba(255,255,255,0.1);
        }

        /* ── FEATURE ICONS AVEC IMAGE BG ── */
        .sp-feat-section-bg {
          position: relative; z-index: 1;
          padding: 0 1.5rem 5rem; max-width: 900px; margin: 0 auto;
        }
        .sp-feat-section-bg::before {
          content: '';
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── SECTION BRAND IMAGE ── */
        .sp-brand-img-section {
          position: relative; z-index: 1;
          max-width: 900px; margin: 0 auto 5rem; padding: 0 1.5rem;
        }
        .sp-brand-img-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
          border-radius: 16px; overflow: hidden;
        }
        .sp-brand-img-grid img {
          width: 100%; height: 180px; object-fit: cover; display: block;
          filter: brightness(0.7) saturate(0.85);
          transition: filter 0.3s, transform 0.3s;
        }
        .sp-brand-img-grid img:hover {
          filter: brightness(0.9) saturate(1);
          transform: scale(1.03);
        }
        .sp-brand-img-grid div { overflow: hidden; }
        .sp-brand-img-label {
          text-align: center; font-size: 12px;
          color: rgba(221,225,235,0.4); margin-top: 1rem;
          font-weight: 300;
        }


        @media (max-width: 768px) {
          .sp-nav-links { display: none; }
          .sp-nav-cta.desktop-only { display: none; }
          .sp-burger { display: block; }
        }
        @media (max-width: 640px) {
          .sp-mock-kpis { grid-template-columns: repeat(2,1fr); }
          .sp-mock-bottom { grid-template-columns: 1fr; }
          .sp-feat-grid { grid-template-columns: 1fr 1fr; }
          .sp-steps-grid { grid-template-columns: 1fr; }
          .sp-testi-grid { grid-template-columns: 1fr; }
          .sp-pricing-grid { grid-template-columns: 1fr; }
          .sp-stats { flex-wrap: wrap; }
          .sp-stat { border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.06); }
          .sp-footer { flex-direction: column; align-items: center; text-align: center; }
          .sp-nav { padding: 0 1.2rem; }
          .sp-hero-img img { height: 200px; }
          .sp-brand-img-grid { grid-template-columns: 1fr; }
          .sp-brand-img-grid img { height: 160px; }
        }
        @media (min-width: 769px) {
          .sp-mobile-menu { display: none !important; }
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-grid-bg" />
        <div className="sp-glow" />

        {/* ✅ NAV avec Link React Router + burger menu */}
        <nav className="sp-nav">
          <Link className="sp-logo" to="/">Shop<em>Pro</em></Link>

          <ul className="sp-nav-links">
            {navLinks.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>

          <Link className="sp-nav-cta desktop-only" to="/login">
            <i className="ti ti-login" aria-hidden="true" />
            Se connecter
          </Link>

          <button
            className="sp-burger"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"}`} aria-hidden="true" />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div className={`sp-mobile-menu${menuOpen ? " open" : ""}`} role="navigation" aria-label="Menu mobile">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <Link className="sp-mobile-cta" to="/login" onClick={() => setMenuOpen(false)}>
            <i className="ti ti-login" aria-hidden="true" />
            Se connecter
          </Link>
        </div>

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
          {/* ✅ NOUVEAU : drapeaux des pays ciblés */}
          <div className="sp-hero-flags sp-animate sp-animate-d2" aria-label="Pays couverts : Togo, Côte d'Ivoire, Sénégal, Bénin">
            🇹🇬 🇨🇮 🇸🇳 🇧🇯
          </div>
          <div className="sp-hero-btns sp-animate sp-animate-d3">
            <Link className="sp-btn-p" to="/login">
              <i className="ti ti-rocket" aria-hidden="true" />
              Commencer gratuitement
            </Link>
            <Link className="sp-btn-s" to="/dashboard">
              <i className="ti ti-eye" aria-hidden="true" />
              Voir le dashboard
            </Link>
          </div>
        </section>

        {/* IMAGE HERO — ambiance marché africain */}
        <div className="sp-hero-img-wrap sp-animate">
          <div className="sp-hero-img">
            <img
              src={heroImage}
              alt="Commerçants africains utilisant ShopPro"
              loading="lazy"
            />
            <div className="sp-hero-img-overlay" />
            <div className="sp-hero-img-caption">
              <div className="sp-hero-img-tag">
                <i className="ti ti-map-pin" aria-hidden="true" />
                Lomé, Togo — Marché de Kégué
              </div>
              <div className="sp-hero-img-tag">
                <i className="ti ti-device-mobile" aria-hidden="true" />
                Géré avec ShopPro
              </div>
            </div>
          </div>
        </div>

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
                  {mockProducts.map((r) => (
                    <div className="sp-row" key={r.n}>
                      <img src={r.img} alt={r.n} className="sp-row-img" loading="lazy" />
                      <span className="sp-row-name" style={{ flex: 1 }}>{r.n}</span>
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

        {/* GRILLE D'IMAGES AMBIANCE */}
        <div className="sp-brand-img-section sp-animate">
          <div className="sp-brand-img-grid">
            {[
              { src: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=240&fit=crop&crop=center", alt: "Marché africain animé" },
              { src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=240&fit=crop&crop=center", alt: "Commerçante avec tablette" },
              { src: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=240&fit=crop&crop=center", alt: "Paiement mobile en Afrique" },
            ].map((img) => (
              <div key={img.alt}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
          <p className="sp-brand-img-label">ShopPro — conçu pour le commerce africain au quotidien</p>
        </div>

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

        {/* ✅ NOUVEAU : TÉMOIGNAGES */}
        <section className="sp-testi-section">
          <div className="sp-section-eyebrow sp-animate">Témoignages</div>
          <h2 className="sp-section-h2 sp-animate sp-animate-d1">Ils gèrent leur boutique avec ShopPro</h2>
          <p className="sp-section-sub sp-animate sp-animate-d2">Des commerçants de toute l'Afrique francophone nous font confiance.</p>
          <div className="sp-testi-grid">
            {testimonials.map((t, i) => (
              <div className={`sp-testi-card sp-animate sp-animate-d${i + 1}`} key={t.name}>
                <div className="sp-testi-stars">★★★★★</div>
                <p className="sp-testi-text">"{t.text}"</p>
                <div className="sp-testi-author">
                  <div className="sp-testi-avatar" style={{ width: 40, height: 40 }}>
                    <img src={t.photo} alt={t.name} loading="lazy" />
                  </div>
                  <div>
                    <div className="sp-testi-name">{t.name}</div>
                    <div className="sp-testi-role">{t.role}</div>
                  </div>
                  <span className="sp-testi-flag" aria-hidden="true">{t.flag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ NOUVEAU : PRICING */}
        <section className="sp-pricing-section">
          <div className="sp-section-eyebrow sp-animate">Tarifs</div>
          <h2 className="sp-section-h2 sp-animate sp-animate-d1">Un plan pour chaque commerce</h2>
          <p className="sp-section-sub sp-animate sp-animate-d2">Commencez gratuitement, évoluez à votre rythme.</p>
          <div className="sp-pricing-grid">
            {plans.map((p, i) => (
              <div
                className={`sp-plan sp-animate sp-animate-d${i + 1}${p.highlight ? " highlighted" : ""}`}
                key={p.name}
                style={{ marginTop: p.highlight ? "12px" : "0" }}
              >
                {p.highlight && <div className="sp-plan-badge">⭐ Le plus populaire</div>}
                <div className="sp-plan-name">{p.name.toUpperCase()}</div>
                <div className="sp-plan-price-row">
                  <span className="sp-plan-price">{p.price}</span>
                  <span className="sp-plan-period">{p.period}</span>
                </div>
                <div className="sp-plan-desc">{p.desc}</div>
                <div className="sp-plan-divider" />
                <div className="sp-plan-features">
                  {p.features.map((f) => (
                    <div className="sp-plan-feat" key={f}>
                      <i className="ti ti-check" aria-hidden="true" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  className={`sp-plan-cta ${p.highlight ? "primary" : "secondary"}`}
                  to={p.name === "Business" ? "/contact" : "/login"}
                >
                  <i className={`ti ${p.highlight ? "ti-rocket" : "ti-arrow-right"}`} aria-hidden="true" />
                  {p.cta}
                </Link>
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
              <Link className="sp-btn-p" to="/login">
                <i className="ti ti-rocket" aria-hidden="true" />
                Créer mon compte
              </Link>
              <Link className="sp-btn-s" to="/dashboard">
                <i className="ti ti-layout-dashboard" aria-hidden="true" />
                Explorer le dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sp-footer">
          <Link className="sp-footer-logo" to="/">Shop<em>Pro</em></Link>
          <span className="sp-footer-copy">© 2025 TOXIMA · Tous droits réservés</span>
          <span className="sp-footer-tech">React · Vite · Supabase · Tailwind</span>
        </footer>
      </div>
    </>
  );
}