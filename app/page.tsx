import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
var C = {
  bg:       "#ffffff",
  surface:  "#f9fafb",
  surface2: "#f3f4f6",
  border:   "#e5e7eb",
  topbar:   "#17564A",
  topbar2:  "#1e6e5e",
  primary:  "#17564A",
  accent:   "#6DBC78",
  text:     "#111827",
  sub:      "#374151",
  muted:    "#6b7280",
  faint:    "#d1d5db",
  warn:     "#f59e0b",
  danger:   "#ef4444",
};

// ─── DELTA COLOR HELPER ───────────────────────────────────────────────────────
// Returns color on a gradient: green (>=15%) → lime (8%) → orange (0%) → red (<0%)
function deltaColor(str) {
  if (!str || str === "stable") return { fg: C.muted, bg: C.muted + "18" };
  var num = parseFloat(str.replace(",", "."));
  if (isNaN(num)) return { fg: C.muted, bg: C.muted + "18" };
  if (num >= 15)  return { fg: "#16a34a", bg: "#16a34a18" };
  if (num >= 8)   return { fg: "#65a30d", bg: "#65a30d18" };
  if (num >= 2)   return { fg: "#ca8a04", bg: "#ca8a0418" };
  if (num >= 0)   return { fg: "#ea580c", bg: "#ea580c18" };
  return           { fg: "#dc2626", bg: "#dc262618" };
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
var trendData = [
  { date: "1 avr", sessions: 4200, users: 3100, events: 12400 },
  { date: "5 avr", sessions: 3800, users: 2800, events: 11200 },
  { date: "9 avr", sessions: 5100, users: 3900, events: 15300 },
  { date: "13 avr", sessions: 4700, users: 3500, events: 14100 },
  { date: "17 avr", sessions: 6200, users: 4800, events: 18600 },
  { date: "21 avr", sessions: 5800, users: 4400, events: 17400 },
  { date: "25 avr", sessions: 7100, users: 5500, events: 21300 },
  { date: "29 avr", sessions: 6600, users: 5100, events: 19800 },
  { date: "3 mai",  sessions: 7800, users: 6100, events: 23400 },
];

var channelData = [
  { name: "Organique",  sessions: 34, color: C.accent },
  { name: "Direct",     sessions: 22, color: "#60a5fa" },
  { name: "Social",     sessions: 18, color: "#f59e0b" },
  { name: "Referral",   sessions: 14, color: "#a78bfa" },
  { name: "Email",      sessions: 8,  color: "#f472b6" },
  { name: "Autre",      sessions: 4,  color: "#9ca3af" },
];

var gscTrend = [
  { date: "1 avr", clicks: 980,  impressions: 28000 },
  { date: "5 avr", clicks: 870,  impressions: 24500 },
  { date: "9 avr", clicks: 1200, impressions: 33000 },
  { date: "13 avr", clicks: 1050, impressions: 30200 },
  { date: "17 avr", clicks: 1480, impressions: 41000 },
  { date: "21 avr", clicks: 1350, impressions: 38500 },
  { date: "25 avr", clicks: 1720, impressions: 47200 },
  { date: "29 avr", clicks: 1580, impressions: 44000 },
  { date: "3 mai",  clicks: 1900, impressions: 52000 },
];

var keywords = [
  { keyword: "agence seo montreal",       position: 3, clicks: 284, impressions: 4200, ctr: "6.8%" },
  { keyword: "marketing digital quebec",  position: 5, clicks: 196, impressions: 3800, ctr: "5.2%" },
  { keyword: "publicite google ads",      position: 2, clicks: 412, impressions: 6100, ctr: "6.8%" },
  { keyword: "strategie reseaux sociaux", position: 8, clicks: 98,  impressions: 2400, ctr: "4.1%" },
  { keyword: "referencement naturel",     position: 4, clicks: 231, impressions: 4700, ctr: "4.9%" },
  { keyword: "agence web eco-responsable",position: 1, clicks: 521, impressions: 7200, ctr: "7.2%" },
];

var topPages = [
  { page: "/",                    clicks: 521, impressions: 7200, position: 1.2 },
  { page: "/services/seo",        clicks: 284, impressions: 4200, position: 3.1 },
  { page: "/blog/eco-responsable",clicks: 196, impressions: 3800, position: 5.4 },
  { page: "/contact",             clicks: 145, impressions: 2900, position: 6.2 },
  { page: "/services/meta-ads",   clicks: 98,  impressions: 2400, position: 8.7 },
];

var fbTrend = [
  { date: "Sem 1", followers: 7010, reach: 18400, engagement: 2100, impressions: 52000 },
  { date: "Sem 2", followers: 7035, reach: 21000, engagement: 2450, impressions: 61000 },
  { date: "Sem 3", followers: 7051, reach: 19200, engagement: 2200, impressions: 57000 },
  { date: "Sem 4", followers: 7063, reach: 25800, engagement: 3100, impressions: 74000 },
];

var igTrend = [
  { date: "Sem 1", followers: 142, reach: 8200,  engagement: 980,  views: 14200 },
  { date: "Sem 2", followers: 145, reach: 9100,  engagement: 1120, views: 16800 },
  { date: "Sem 3", followers: 146, reach: 8700,  engagement: 1050, views: 15600 },
  { date: "Sem 4", followers: 148, reach: 11200, engagement: 1380, views: 19400 },
];

var liTrend = [
  { date: "Jan", followers: 55200, impressions: 12400, clicks: 340 },
  { date: "Fev", followers: 55800, impressions: 13100, clicks: 380 },
  { date: "Mar", followers: 56400, impressions: 14800, clicks: 420 },
  { date: "Avr", followers: 57055, impressions: 16200, clicks: 461 },
];

var gbpTrend = [
  { date: "Jan", views: 1800, clicks: 180, calls: 42 },
  { date: "Fev", views: 2100, clicks: 210, calls: 51 },
  { date: "Mar", views: 1950, clicks: 195, calls: 47 },
  { date: "Avr", views: 2440, clicks: 244, calls: 58 },
];

var reviews = [
  { name: "Marie Tremblay",  rating: 5, text: "Agence eco-responsable et tres professionnelle !", date: "25 avr 2025" },
  { name: "Jean-Luc Perron", rating: 5, text: "Resultats impressionnants en SEO local",          date: "22 avr 2025" },
  { name: "Sophie Gagnon",   rating: 4, text: "Tres bonne communication, je recommande",         date: "18 avr 2025" },
  { name: "Carlos Mendez",   rating: 5, text: "Excellent travail sur notre strategie digitale",  date: "15 avr 2025" },
  { name: "Isabelle Roy",    rating: 5, text: "Super equipe, valeurs eco partagees",             date: "10 avr 2025" },
  { name: "Patrick Lavoie",  rating: 4, text: "Bons resultats, accompagnement de qualite",      date: "5 avr 2025" },
];

var backlinks = [
  { source: "techcrunch.com",      target: "Accueil", date: "24 avr 2025", type: "Suivi",     pageAuth: 86, domainAuth: 93 },
  { source: "moz.com",             target: "Blog SEO",date: "22 avr 2025", type: "Suivi",     pageAuth: 74, domainAuth: 91 },
  { source: "searchengineland.com",target: "Services",date: "19 avr 2025", type: "Suivi",     pageAuth: 65, domainAuth: 84 },
  { source: "hubspot.com",         target: "Accueil", date: "18 avr 2025", type: "Non-Suivi", pageAuth: 72, domainAuth: 93 },
  { source: "semrush.com",         target: "Blog",    date: "15 avr 2025", type: "Suivi",     pageAuth: 58, domainAuth: 86 },
  { source: "ahrefs.com",          target: "Accueil", date: "14 avr 2025", type: "Suivi",     pageAuth: 63, domainAuth: 88 },
];

var backlinkTypes = [
  { name: "Portail",   value: 26, color: C.accent },
  { name: "Reseau",    value: 13, color: "#60a5fa" },
  { name: "Annuaire",  value: 11, color: "#f59e0b" },
  { name: "Blog",      value: 14, color: "#a78bfa" },
];

var speedAudits = [
  { name: "Canonical Tag",       status: "pass", detail: "Tous les docs ont des liens canoniques" },
  { name: "Meta Description",    status: "warn", detail: "Aide les moteurs de recherche a comprendre le contenu" },
  { name: "HTTPS Redirect",      status: "pass", detail: "Toutes les donnees sont protegees" },
  { name: "Cache Static Assets", status: "fail", detail: "Les scripts tiers impactent les performances" },
  { name: "Core Web Vitals",     status: "warn", detail: "Application cache est deprecie" },
  { name: "Robots.txt",          status: "pass", detail: "Toutes les donnees sont protegees" },
  { name: "Third Party Scripts", status: "fail", detail: "Application cache est deprecie" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function TT(props) {
  if (!props.active || !props.payload || !props.payload.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid " + C.border, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: 700 }}>{props.label}</div>
      {props.payload.map(function(p, i) {
        return (
          <div key={i} style={{ color: p.color, fontSize: 14, marginBottom: 2 }}>
            <span style={{ fontWeight: 600 }}>{p.name}: </span>
            <span style={{ color: C.sub }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function Card(props) {
  return (
    <div style={Object.assign({
      background: C.bg, border: "1px solid " + C.border,
      borderRadius: 12, padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
    }, props.style || {})}>
      {props.children}
    </div>
  );
}

function SectionTitle(props) {
  return (
    <div style={{ marginBottom: props.mb || 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <div style={{ width: 3, height: 15, background: props.color || C.primary, borderRadius: 2 }} />
        <span style={{ fontWeight: 700, color: C.text, fontSize: 16, fontFamily: "'Josefin Sans', sans-serif" }}>{props.title}</span>
      </div>
      {props.sub && <p style={{ margin: "0 0 0 11px", fontSize: 13, color: C.muted }}>{props.sub}</p>}
    </div>
  );
}

function Delta(props) {
  var dc = deltaColor(props.val);
  return (
    <span style={{
      fontSize: 13, fontWeight: 700,
      color: dc.fg, background: dc.bg,
      padding: "2px 8px", borderRadius: 20,
      display: "inline-block"
    }}>{props.val}</span>
  );
}

function KpiBox(props) {
  return (
    <div style={{
      background: C.bg, border: "1px solid " + C.border,
      borderRadius: 12, padding: "16px 18px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Josefin Sans', sans-serif" }}>{props.label}</div>
      <div style={{ fontSize: 27, fontWeight: 800, color: C.text, marginBottom: 8, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "-0.01em" }}>{props.value}</div>
      {props.delta && <Delta val={props.delta} />}
      {props.sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{props.sub}</div>}
    </div>
  );
}

function Stars(props) {
  return (
    <span>
      {[1,2,3,4,5].map(function(i) {
        return <span key={i} style={{ color: i <= props.n ? "#f59e0b" : C.faint, fontSize: 16 }}>★</span>;
      })}
    </span>
  );
}

function ScoreCircle(props) {
  var color = props.score >= 80 ? "#16a34a" : props.score >= 60 ? "#ca8a04" : "#dc2626";
  var r = 30, circ = 2 * Math.PI * r;
  var dash = (props.score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke={C.surface2} strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={dash + " " + (circ - dash)}
          strokeDashoffset={circ / 4} strokeLinecap="round" />
        <text x="40" y="45" textAnchor="middle" fill={C.text} fontSize="16" fontWeight="800">{props.score}</text>
      </svg>
      <span style={{ fontSize: 14, color: C.muted, fontWeight: 600 }}>{props.label}</span>
      <span style={{ fontSize: 15, color: color, fontWeight: 700 }}>{props.value}</span>
    </div>
  );
}

function BarPct(props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: C.sub }}>{props.label}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {props.sub && <span style={{ fontSize: 13, color: C.muted }}>{props.sub}</span>}
          <span style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{props.pct}%</span>
        </div>
      </div>
      <div style={{ height: 5, background: C.surface2, borderRadius: 99 }}>
        <div style={{ height: "100%", width: props.pct + "%", background: C.accent, borderRadius: 99 }} />
      </div>
    </div>
  );
}

function TableHead(props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: props.cols, padding: "6px 10px", borderBottom: "2px solid " + C.border, background: C.surface }}>
      {props.headers.map(function(h) {
        return <span key={h} style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>;
      })}
    </div>
  );
}


// ─── GLOSSAIRE ────────────────────────────────────────────────────────────────

var GLOSSAIRES = {
  overview: [
    { term: "Sessions",         def: "Nombre de visites sur ton site. Une session = une visite, peu importe combien de pages ont ete consultees." },
    { term: "Clics GSC",        def: "Nombre de fois que ton site a ete clique dans les resultats Google (Search Console)." },
    { term: "Abonnes",          def: "Personnes qui suivent ta page sur les reseaux sociaux et verront tes publications." },
    { term: "Note GBP",         def: "Note moyenne de tes avis Google Business Profile, sur 5 etoiles." },
    { term: "Backlinks",        def: "Liens provenant d'autres sites vers le tien. Plus ils sont nombreux et de qualite, mieux c'est pour ton referencement." },
    { term: "PageSpeed",        def: "Score de performance de ton site mesure par Google. Plus il est proche de 100, plus ton site charge vite." },
  ],
  gbp: [
    { term: "Google Business Profile (GBP)", def: "Ta fiche Google : ce que les gens voient quand ils cherchent ton entreprise sur Google ou Maps." },
    { term: "Interactions",     def: "Toutes les actions effectuees sur ta fiche : clics, appels, itineraires, visites de site..." },
    { term: "Clics itineraire", def: "Nombre de fois que quelqu'un a demande l'itineraire vers ton adresse via Google Maps." },
    { term: "Impressions",      def: "Nombre de fois que ta fiche est apparue dans les resultats de recherche ou sur Maps." },
    { term: "Note moyenne",     def: "Moyenne de toutes les etoiles recues dans tes avis Google. La cible ideale est 4.5+." },
  ],
  facebook: [
    { term: "Abonnes",          def: "Nombre de personnes qui suivent ta page Facebook et verront tes publications dans leur fil." },
    { term: "Portee",           def: "Nombre de personnes uniques qui ont vu au moins une de tes publications, qu'elles soient abonnees ou non." },
    { term: "Engagement",       def: "Total des interactions sur tes posts : likes, commentaires, partages, clics. Indique si ton contenu interesse ton audience." },
    { term: "Impressions",      def: "Nombre total de fois que tes contenus ont ete affiches (une meme personne peut generer plusieurs impressions)." },
    { term: "Taux d'engagement",def: "Pourcentage de personnes ayant interagi par rapport a la portee. Un bon taux tourne autour de 1 a 5%." },
  ],
  instagram: [
    { term: "Abonnes",          def: "Nombre de comptes qui suivent ton profil Instagram." },
    { term: "Portee",           def: "Nombre de comptes uniques ayant vu au moins un de tes contenus sur la periode." },
    { term: "Engagement",       def: "Ensemble des interactions : likes, commentaires, partages, sauvegardes, clics sur le profil." },
    { term: "Vues",             def: "Nombre total de visionnages de tes Reels et videos (une personne peut visionner plusieurs fois)." },
    { term: "Audience",         def: "Caracteristiques demographiques de tes abonnes : pays, age, genre. Utile pour adapter ton contenu." },
  ],
  linkedin: [
    { term: "Abonnes",          def: "Personnes qui suivent ta page entreprise LinkedIn et recevront tes publications." },
    { term: "Impressions",      def: "Nombre de fois que tes publications ont ete affichees dans les fils d'actualite." },
    { term: "Clics",            def: "Nombre de clics sur tes publications, ton logo ou le nom de ta page." },
    { term: "Reactions",        def: "Likes et autres reactions sur tes publications (J'aime, Bravo, Interessant, etc.)." },
    { term: "Taille entreprise",def: "Segmentation de tes abonnes selon la taille de leur entreprise. Utile pour verifier si tu touches ta cible B2B." },
  ],
  ga4: [
    { term: "Sessions",         def: "Nombre de visites sur ton site. Une nouvelle session commence apres 30 minutes d'inactivite." },
    { term: "Utilisateurs",     def: "Nombre de visiteurs uniques. Un meme visiteur peut generer plusieurs sessions." },
    { term: "Duree moyenne",    def: "Temps moyen passe sur ton site par session. Plus c'est eleve, plus le contenu interesse les visiteurs." },
    { term: "Evenements",       def: "Actions effectuees sur ton site : clics, scrolls, telechargements, visionnages de videos..." },
    { term: "Evenements cles",  def: "Actions importantes definies comme objectifs : formulaire rempli, achat, inscription..." },
    { term: "Taux de rebond",   def: "Pourcentage de visiteurs qui quittent ton site apres avoir vu une seule page. Un taux eleve peut indiquer un probleme de contenu ou de vitesse." },
    { term: "Canal d'acquisition", def: "D'ou viennent tes visiteurs : Google (organique), publicites (paid), reseaux sociaux, email, liens d'autres sites (referral)..." },
  ],
  gsc: [
    { term: "Clics",            def: "Nombre de fois que ton site a ete clique dans les resultats de recherche Google." },
    { term: "Impressions",      def: "Nombre de fois que ton site est apparu dans les resultats Google, meme si personne n'a clique." },
    { term: "CTR (Click-Through Rate)", def: "Taux de clic : pourcentage de personnes qui ont clique apres avoir vu ton site dans Google. Un bon CTR se situe entre 3 et 10%." },
    { term: "Position moyenne", def: "Rang moyen de ton site dans les resultats Google. Position 1 = premier resultat. En dessous de 10 = page 1." },
    { term: "Mots-cles",        def: "Les termes tapes par les internautes qui font apparaitre ton site dans Google." },
  ],
  backlinks: [
    { term: "Backlinks",        def: "Liens provenant d'autres sites vers le tien. Ils renforcent ta credibilite aux yeux de Google." },
    { term: "Domaines referents",def: "Nombre de sites differents qui pointent vers toi. 10 liens de 10 sites differents vaut mieux que 10 liens du meme site." },
    { term: "Lien Suivi (Dofollow)", def: "Lien qui transmet de l'autorite SEO a ton site. C'est le type de lien le plus precieux." },
    { term: "Lien Non-Suivi (Nofollow)", def: "Lien qui ne transmet pas d'autorite SEO directement, mais reste utile pour la visibilite et le trafic." },
    { term: "Autorite de page", def: "Score (0-100) estimant la force d'une page specifique. Plus c'est eleve, plus le lien qui en vient a de valeur." },
    { term: "Autorite de domaine", def: "Score (0-100) estimant la credibilite globale d'un site. Un backlink d'un site avec un score eleve est tres precieux." },
  ],
  pagespeed: [
    { term: "PageSpeed Score",  def: "Note globale de performance de ton site (0-100). En dessous de 50 = lent, 50-89 = moyen, 90+ = rapide." },
    { term: "LCP (Largest Contentful Paint)", def: "Temps pour afficher le plus grand element visible de la page (image, titre...). Objectif : moins de 2.5 secondes." },
    { term: "FCP (First Contentful Paint)", def: "Temps avant que le premier contenu (texte ou image) apparaisse a l'ecran. Objectif : moins de 1.8 secondes." },
    { term: "TBT (Total Blocking Time)", def: "Temps pendant lequel la page est 'bloquee' et ne repond pas aux clics. Objectif : moins de 200ms." },
    { term: "CLS (Cumulative Layout Shift)", def: "Mesure les 'sauts' visuels de la page pendant le chargement. Un CLS eleve = elements qui bougent et desorientent l'utilisateur. Objectif : moins de 0.1." },
    { term: "TTFB (Time to First Byte)", def: "Temps que met le serveur a repondre. C'est la base : si le serveur est lent, tout le reste sera lent." },
    { term: "Audit Canonical",  def: "Verifie que chaque page indique a Google quelle est la version 'officielle' de l'URL, evitant le contenu duplique." },
    { term: "Audit Robots.txt", def: "Fichier qui dit a Google quelles pages indexer ou non. Une erreur ici peut cacher tout ton site de Google." },
  ],
};

function Glossaire(props) {
  var terms = GLOSSAIRES[props.tab] || [];
  var [open, setOpen] = useState(false);
  if (!terms.length) return null;
  return (
    <div style={{ marginTop: 32, border: "1px solid " + C.border, borderRadius: 12, overflow: "hidden" }}>
      <button
        onClick={function() { setOpen(!open); }}
        style={{
          width: "100%", background: C.surface, border: "none",
          padding: "14px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", cursor: "pointer",
          fontFamily: "'Josefin Sans', sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📖</span>
          <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>Glossaire — Comprendre les indicateurs</span>
          <span style={{ fontSize: 13, color: C.muted, background: C.surface2, padding: "2px 8px", borderRadius: 20 }}>{terms.length} termes</span>
        </div>
        <span style={{ color: C.muted, fontSize: 18, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "4px 0 8px", background: C.bg }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 0 }}>
            {terms.map(function(t, i) {
              return (
                <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid " + C.border, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, color: C.primary, fontSize: 14, fontFamily: "'Josefin Sans', sans-serif" }}>{t.term}</span>
                    <p style={{ margin: "3px 0 0", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{t.def}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB VIEWS ────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Sessions GA4"  value="47 500" delta="+18.4%" />
        <KpiBox label="Clics GSC"     value="10 130" delta="+12.1%" />
        <KpiBox label="Abonnes FB"    value="7 063"  delta="+0.7%" />
        <KpiBox label="Abonnes IG"    value="148"    delta="+4.2%" />
        <KpiBox label="Abonnes LI"    value="57 055" delta="+1.5%" />
        <KpiBox label="Note GBP"      value="4.66"   delta="+0.4%" />
        <KpiBox label="Backlinks"     value="64"     delta="+14.3%" />
        <KpiBox label="PageSpeed"     value="46/100" delta="-4.2%" />
      </div>
      <Card>
        <SectionTitle title="Sessions GA4" sub="Tendance sur 30 jours" />
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="gOv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.accent} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <Tooltip content={<TT />} />
            <Area type="monotone" dataKey="sessions" name="Sessions" stroke={C.accent} strokeWidth={2} fill="url(#gOv)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Glossaire tab="overview" />
    </div>
  );
}

function GBPTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Interactions"    value="206"   delta="+14.4%" />
        <KpiBox label="Clics itineraire"value="124"   delta="+9.7%" />
        <KpiBox label="Recherche Maps"  value="91"    delta="+5.8%" />
        <KpiBox label="Note moyenne"    value="4.66"  delta="+0.4%" />
        <KpiBox label="Total avis"      value="1 241" delta="+3.9%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Impressions fiche" sub="Avril 2025" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gbpTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Bar dataKey="views" name="Vues" fill={C.accent} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Clics & Appels" sub="Avril 2025" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gbpTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
              <Bar dataKey="clicks" name="Clics" fill={C.accent} radius={[4,4,0,0]} />
              <Bar dataKey="calls"  name="Appels" fill="#60a5fa" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Avis recents" sub="Tries par date" color="#f59e0b" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12, marginTop: 8 }}>
          {reviews.map(function(r, i) {
            return (
              <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{r.name}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>{r.date}</span>
                </div>
                <Stars n={r.rating} />
                <p style={{ fontSize: 14, color: C.sub, margin: "6px 0 0" }}>{r.text}</p>
              </div>
            );
          })}
        </div>
      </Card>
      <Glossaire tab="gbp" />
    </div>
  );
}

function FacebookTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Abonnes page"    value="7 063"   delta="+0.7%" />
        <KpiBox label="Portee totale"   value="84 400"  delta="+18.3%" />
        <KpiBox label="Engagement"      value="9 850"   delta="+22.1%" />
        <KpiBox label="Impressions"     value="244 000" delta="+15.4%" />
        <KpiBox label="Taux engagement" value="2.58%"   delta="+0.3%" />
        <KpiBox label="Impr. par post"  value="195"     delta="+6.6%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Croissance abonnes" sub="Par semaine" />
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={fbTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} domain={["auto","auto"]} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="followers" name="Abonnes" stroke={C.accent} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Portee & Engagement" sub="Par semaine" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fbTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
              <Bar dataKey="reach"      name="Portee"      fill={C.accent}  radius={[4,4,0,0]} />
              <Bar dataKey="engagement" name="Engagement"  fill="#60a5fa"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Impressions de page" sub="Evolution mensuelle" />
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={fbTrend}>
            <defs>
              <linearGradient id="gFbImp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.accent} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <Tooltip content={<TT />} />
            <Area type="monotone" dataKey="impressions" name="Impressions" stroke={C.accent} strokeWidth={2} fill="url(#gFbImp)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Glossaire tab="facebook" />
    </div>
  );
}

function InstagramTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Abonnes"      value="148"    delta="+4.2%" />
        <KpiBox label="Portee"       value="37 200" delta="+21.4%" />
        <KpiBox label="Engagement"   value="4 204"  delta="+18.2%" />
        <KpiBox label="Vues"         value="66 000" delta="+25.0%" />
        <KpiBox label="Partages"     value="1 834"  delta="+9.3%" />
        <KpiBox label="Commentaires" value="1 488"  delta="+14.1%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Croissance abonnes" sub="Par semaine" />
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={igTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} domain={["auto","auto"]} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="followers" name="Abonnes" stroke={C.accent} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Portee & Engagement" sub="Par semaine" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={igTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
              <Bar dataKey="reach"      name="Portee"     fill={C.accent} radius={[4,4,0,0]} />
              <Bar dataKey="engagement" name="Engagement" fill="#60a5fa"  radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Audience par pays" sub="Top 5 pays" />
        <div style={{ marginTop: 8 }}>
          <BarPct label="🇨🇦 Canada"          pct={52} />
          <BarPct label="🇲🇽 Mexique"          pct={18} />
          <BarPct label="🇰🇷 Coree du Sud"     pct={12} />
          <BarPct label="🇸🇦 Arabie Saoudite"  pct={9}  />
          <BarPct label="🇵🇭 Philippines"      pct={9}  />
        </div>
      </Card>
      <Glossaire tab="instagram" />
    </div>
  );
}

function LinkedInTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Abonnes"      value="57 055" delta="+1.5%" />
        <KpiBox label="Impressions"  value="56 500" delta="+9.8%" />
        <KpiBox label="Clics"        value="461"    delta="+8.2%" />
        <KpiBox label="Reactions"    value="280"    delta="+17.4%" />
        <KpiBox label="Partages"     value="96"     delta="+5.5%" />
        <KpiBox label="Commentaires" value="52"     delta="+12.2%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Croissance abonnes" sub="Par mois" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={liTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} domain={["auto","auto"]} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="followers" name="Abonnes" stroke={C.accent} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Impressions & Clics" sub="Par mois" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={liTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
              <Bar dataKey="impressions" name="Impressions" fill={C.accent} radius={[4,4,0,0]} />
              <Bar dataKey="clicks"      name="Clics"       fill="#60a5fa" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Audience - Taille entreprise" />
        <div style={{ marginTop: 8 }}>
          <BarPct label="Self Employed"      pct={28} sub="1 347" />
          <BarPct label="1-10 Employes"      pct={22} sub="1 082" />
          <BarPct label="11-50 Employes"     pct={21} sub="998"   />
          <BarPct label="51-200 Employes"    pct={18} sub="856"   />
          <BarPct label="201-500 Employes"   pct={11} sub="541"   />
        </div>
      </Card>
      <Glossaire tab="linkedin" />
    </div>
  );
}

function GATab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Sessions"     value="1 104" delta="+12.2%" />
        <KpiBox label="Utilisateurs" value="761"   delta="+8.5%" />
        <KpiBox label="Duree moy."   value="23m 31s" delta="+9.5%" />
        <KpiBox label="Evenements"   value="1 798" delta="+15.3%" />
        <KpiBox label="Evts cles"    value="649"   delta="+21.0%" />
        <KpiBox label="Nb evts"      value="732"   delta="+9.2%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Sessions & Utilisateurs" sub="Tendance 30 jours" />
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gGaS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.accent} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
              <Area type="monotone" dataKey="sessions" name="Sessions"      stroke={C.accent} strokeWidth={2} fill="url(#gGaS)" />
              <Area type="monotone" dataKey="users"    name="Utilisateurs"  stroke="#60a5fa"  strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle title="Canaux d'acquisition" sub="Part du trafic (%)" />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <PieChart width={120} height={120}>
              <Pie data={channelData} dataKey="sessions" cx={55} cy={55} innerRadius={32} outerRadius={52} paddingAngle={2}>
                {channelData.map(function(c, i) { return <Cell key={i} fill={c.color} />; })}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {channelData.map(function(c) {
                return (
                  <div key={c.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color }} />
                      <span style={{ fontSize: 13, color: C.sub }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 13, color: c.color, fontWeight: 700 }}>{c.sessions}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Acquisition par canal" sub="Sessions, Users, Duree, Evts cles, Taux de rebond" />
        <TableHead cols="1.5fr 80px 80px 90px 70px 90px" headers={["Canal","Sessions","Users","Duree","Evts","Rebond"]} />
        {[
          { canal: "Direct",         sessions: 54, users: 47, dur: "29m", evts: 93, rebond: "27.5%" },
          { canal: "Paid Search",    sessions: 32, users: 30, dur: "15m", evts: 1,  rebond: "24.1%" },
          { canal: "Organic Social", sessions: 28, users: 25, dur: "7m",  evts: 12, rebond: "29.0%" },
          { canal: "Display",        sessions: 22, users: 20, dur: "3m",  evts: 0,  rebond: "23.5%" },
          { canal: "Referral",       sessions: 18, users: 17, dur: "12m", evts: 10, rebond: "28.4%" },
        ].map(function(row, i) {
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 80px 80px 90px 70px 90px", padding: "10px 10px", borderBottom: "1px solid " + C.border }}>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{row.canal}</span>
              <span style={{ fontSize: 14, color: C.muted }}>{row.sessions}</span>
              <span style={{ fontSize: 14, color: C.muted }}>{row.users}</span>
              <span style={{ fontSize: 14, color: C.muted }}>{row.dur}</span>
              <span style={{ fontSize: 14, color: C.muted }}>{row.evts}</span>
              <span style={{ fontSize: 14, color: C.muted }}>{row.rebond}</span>
            </div>
          );
        })}
      </Card>
      <Glossaire tab="ga4" />
    </div>
  );
}

function GSCTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Total clics"   value="10 130" delta="+12.1%" />
        <KpiBox label="Impressions"   value="338K"   delta="+22.7%" />
        <KpiBox label="CTR moyen"     value="0.73%"  delta="+0.1%" />
        <KpiBox label="Position moy." value="4.2"    delta="-5.6%" />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Clics & Impressions" sub="Tendance 30 jours" />
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={gscTrend}>
            <defs>
              <linearGradient id="gGsc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.accent} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="date" stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <YAxis stroke={C.faint} tick={{ fontSize: 12, fill: C.muted }} />
            <Tooltip content={<TT />} />
            <Legend wrapperStyle={{ fontSize: 13, color: C.muted }} />
            <Area type="monotone" dataKey="clicks"      name="Clics"       stroke={C.accent} strokeWidth={2} fill="url(#gGsc)" />
            <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#60a5fa"  strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle title="Top mots-cles" sub="Position, Impressions, CTR" />
          <TableHead cols="1fr 50px 70px 55px" headers={["Requete","Pos.","Impr.","CTR"]} />
          {keywords.map(function(kw, i) {
            var pc = kw.position <= 3 ? "#16a34a" : kw.position <= 6 ? "#ca8a04" : C.muted;
            var pb = kw.position <= 3 ? "#16a34a18" : kw.position <= 6 ? "#ca8a0418" : C.faint + "40";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 50px 70px 55px", padding: "9px 10px", borderBottom: "1px solid " + C.border }}>
                <span style={{ fontSize: 13, color: C.sub }}>{kw.keyword}</span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, fontSize: 13, fontWeight: 800, background: pb, color: pc }}>{kw.position}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{kw.impressions.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{kw.ctr}</span>
              </div>
            );
          })}
        </Card>
        <Card>
          <SectionTitle title="Top pages" sub="Par clics" />
          <TableHead cols="1fr 60px 70px 60px" headers={["Page","Clics","Impr.","Pos."]} />
          {topPages.map(function(p, i) {
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 70px 60px", padding: "9px 10px", borderBottom: "1px solid " + C.border }}>
                <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>{p.page}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{p.clicks}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{p.impressions.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{p.position}</span>
              </div>
            );
          })}
        </Card>
      </div>
      <Glossaire tab="gsc" />
    </div>
  );
}

function BacklinksTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Liens publics"  value="64"     delta="+14.3%" />
        <KpiBox label="Domaines ref."  value="291"    delta="+8.2%" />
        <KpiBox label="Liens entrants" value="1 806"  delta="+8.4%" />
        <KpiBox label="Liens sortants" value="1 860"  delta="+5.4%" />
        <KpiBox label="Total"          value="25 090" delta="+5.0%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle title="Gestionnaire des liens" sub="Tries par date · Liens publics" />
          <TableHead cols="1.2fr 1fr 95px 80px 65px 65px" headers={["Source","Cible","Date","Type","Auth p.","Auth d."]} />
          {backlinks.map(function(b, i) {
            var isSuivi = b.type === "Suivi";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 95px 80px 65px 65px", padding: "10px 10px", borderBottom: "1px solid " + C.border, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>{b.source}</span>
                <span style={{ fontSize: 13, color: C.sub }}>{b.target}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{b.date}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: isSuivi ? "#16a34a" : C.muted, background: isSuivi ? "#16a34a18" : C.faint + "40", padding: "2px 7px", borderRadius: 20, textAlign: "center" }}>{b.type}</span>
                <div style={{ height: 5, background: C.surface2, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: b.pageAuth + "%", background: C.accent, borderRadius: 99 }} />
                </div>
                <div style={{ height: 5, background: C.surface2, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: b.domainAuth + "%", background: "#60a5fa", borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <SectionTitle title="Types de liens" sub="Repartition" />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <PieChart width={140} height={140}>
              <Pie data={backlinkTypes} dataKey="value" cx={65} cy={65} innerRadius={38} outerRadius={58} paddingAngle={3}>
                {backlinkTypes.map(function(c, i) { return <Cell key={i} fill={c.color} />; })}
              </Pie>
            </PieChart>
          </div>
          {backlinkTypes.map(function(t) {
            return (
              <div key={t.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                  <span style={{ fontSize: 14, color: C.sub }}>{t.name}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.color }}>{t.value}</span>
              </div>
            );
          })}
        </Card>
      </div>
      <Glossaire tab="backlinks" />
    </div>
  );
}

function PageSpeedTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12, marginBottom: 20 }}>
        <KpiBox label="Date analyse"  value="25 mai 2025" />
        <KpiBox label="Score perf."   value="46/100"  delta="-4.2%" />
        <KpiBox label="Score SEO"     value="54/100"  delta="-3.6%" />
        <KpiBox label="Accessibilite" value="56/100"  delta="-2.4%" />
        <KpiBox label="LCP"           value="3.1s"    delta="-8.8%" />
        <KpiBox label="TBT"           value="46ms"    delta="+12.0%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle title="Scores Core Web Vitals" sub="Performance globale — mobile" />
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {[
              { label: "Perf.",   score: 46, value: "46/100" },
              { label: "SEO",     score: 54, value: "54/100" },
              { label: "Access.", score: 56, value: "56/100" },
              { label: "LCP",     score: 54, value: "3.1s"   },
              { label: "TBT",     score: 92, value: "46ms"   },
            ].map(function(m) { return <ScoreCircle key={m.label} label={m.label} score={m.score} value={m.value} />; })}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Temps de chargement" />
          <div style={{ marginTop: 8 }}>
            {[
              { label: "First Contentful Paint (FCP)",    val: "3.4s",  ok: false },
              { label: "Largest Contentful Paint (LCP)",  val: "3.1s",  ok: false },
              { label: "Speed Index (SI)",                val: "3.4s",  ok: false },
              { label: "Total Blocking Time (TBT)",       val: "46ms",  ok: true  },
              { label: "Cumulative Layout Shift (CLS)",   val: "0.37",  ok: false },
              { label: "Time to First Byte (TTFB)",       val: "3.2s",  ok: false },
            ].map(function(m) {
              return (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.border }}>
                  <span style={{ fontSize: 14, color: C.sub }}>{m.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: m.ok ? "#16a34a" : "#ca8a04" }}>{m.val}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Audits techniques" sub="Recommandations PageSpeed" />
        <TableHead cols="28px 1fr 2fr 85px" headers={["","Audit","Detail","Statut"]} />
        {speedAudits.map(function(a, i) {
          var sc = a.status === "pass" ? "#16a34a" : a.status === "warn" ? "#ca8a04" : "#dc2626";
          var icon = a.status === "pass" ? "✓" : a.status === "warn" ? "!" : "✕";
          var label = a.status === "pass" ? "Passe" : a.status === "warn" ? "Attention" : "Echec";
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 2fr 85px", padding: "11px 10px", borderBottom: "1px solid " + C.border, alignItems: "center" }}>
              <span style={{ fontSize: 16, color: sc, fontWeight: 700 }}>{icon}</span>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{a.name}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{a.detail}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: sc, background: sc + "18", padding: "2px 8px", borderRadius: 20, textAlign: "center" }}>{label}</span>
            </div>
          );
        })}
      </Card>
      <Glossaire tab="pagespeed" />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
var TABS = [
  { id: "overview",   label: "Vue d'ensemble" },
  { id: "gbp",        label: "Google Business" },
  { id: "facebook",   label: "Facebook" },
  { id: "instagram",  label: "Instagram" },
  { id: "linkedin",   label: "LinkedIn" },
  { id: "ga4",        label: "Google Analytics" },
  { id: "gsc",        label: "Search Console" },
  { id: "backlinks",  label: "Backlinks" },
  { id: "pagespeed",  label: "PageSpeed" },
];

export default function Dashboard() {
  var [tab, setTab] = useState("overview");
  var [range, setRange] = useState("30j");
  var [showCustom, setShowCustom] = useState(false);
  var [customFrom, setCustomFrom] = useState("2025-01-01");
  var [customTo, setCustomTo] = useState("2025-05-03");

  useEffect(function() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  function renderContent() {
    if (tab === "overview")  return <OverviewTab />;
    if (tab === "gbp")       return <GBPTab />;
    if (tab === "facebook")  return <FacebookTab />;
    if (tab === "instagram") return <InstagramTab />;
    if (tab === "linkedin")  return <LinkedInTab />;
    if (tab === "ga4")       return <GATab />;
    if (tab === "gsc")       return <GSCTab />;
    if (tab === "backlinks") return <BacklinksTab />;
    if (tab === "pagespeed") return <PageSpeedTab />;
    return null;
  }

  var activeLabel = TABS.find(function(t) { return t.id === tab; }).label;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Josefin Sans', system-ui, sans-serif" }}>

      {/* TOP BAR — vert foncé Ocelot */}
      <div style={{
        background: C.topbar, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56, position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="28" height="28" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="8"  fill="rgba(255,255,255,0.15)" />
            <circle cx="15" cy="15" r="4"  fill={C.accent} />
            <circle cx="21" cy="9"  r="2.5" fill="white" opacity="0.9" />
          </svg>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", letterSpacing: "0.06em", lineHeight: 1.1, fontFamily: "'Josefin Sans', sans-serif" }}>agence ocelot</div>
            <div style={{ fontSize: 11,  color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>agence web eco-responsable</div>
          </div>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 8px" }} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>Tableau de bord client</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {["7j","30j","90j","1an"].map(function(r) {
            var isActive = range === r && !showCustom;
            return (
              <button key={r} onClick={function() { setRange(r); setShowCustom(false); }} style={{
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                border: "1px solid " + (isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"),
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                borderRadius: 7, padding: "3px 12px", fontSize: 14,
                fontWeight: 600, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif"
              }}>{r}</button>
            );
          })}
          <button onClick={function() { setShowCustom(!showCustom); }} style={{
            background: showCustom ? "rgba(255,255,255,0.15)" : "transparent",
            border: "1px solid " + (showCustom ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"),
            color: showCustom ? "#ffffff" : "rgba(255,255,255,0.5)",
            borderRadius: 7, padding: "3px 12px", fontSize: 14,
            fontWeight: 600, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 5
          }}>📅 Dates</button>
          <button style={{
            background: C.accent, border: "none", borderRadius: 8,
            padding: "6px 16px", color: C.topbar, fontWeight: 700,
            fontSize: 14, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif"
          }}>Exporter PDF</button>
        </div>
      </div>

      {/* TABS — fond blanc, soulignement vert */}
      <div style={{
        background: C.bg, borderBottom: "1px solid " + C.border,
        overflowX: "auto", display: "flex",
        position: "sticky", top: 56, zIndex: 90, scrollbarWidth: "none"
      }}>
        {TABS.map(function(t) {
          var isActive = tab === t.id;
          return (
            <button key={t.id} onClick={function() { setTab(t.id); }} style={{
              background: "transparent", border: "none", whiteSpace: "nowrap",
              borderBottom: isActive ? "2px solid " + C.primary : "2px solid transparent",
              borderTop: "2px solid transparent",
              padding: "11px 16px", fontSize: 14, fontWeight: isActive ? 700 : 500,
              color: isActive ? C.primary : C.muted,
              cursor: "pointer", flexShrink: 0,
              fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.03em"
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* CUSTOM DATE PICKER */}
      {showCustom && (
        <div style={{
          background: "#f0fdf4", borderBottom: "1px solid #bbf7d0",
          padding: "12px 20px", display: "flex", alignItems: "center", gap: 16,
          flexWrap: "wrap"
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.primary, fontFamily: "'Josefin Sans', sans-serif" }}>📅 Periode personnalisee</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Du</label>
            <input
              type="date" value={customFrom}
              onChange={function(e) { setCustomFrom(e.target.value); }}
              style={{
                border: "1px solid " + C.border, borderRadius: 8, padding: "5px 10px",
                fontSize: 13, color: C.text, background: "#fff",
                fontFamily: "'Josefin Sans', sans-serif", cursor: "pointer"
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Au</label>
            <input
              type="date" value={customTo}
              onChange={function(e) { setCustomTo(e.target.value); }}
              style={{
                border: "1px solid " + C.border, borderRadius: 8, padding: "5px 10px",
                fontSize: 13, color: C.text, background: "#fff",
                fontFamily: "'Josefin Sans', sans-serif", cursor: "pointer"
              }}
            />
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>
            {customFrom && customTo ? (
              <span style={{ color: C.primary, fontWeight: 600 }}>
                {Math.round((new Date(customTo) - new Date(customFrom)) / (1000*60*60*24))} jours selectionnes
              </span>
            ) : null}
          </div>
          <button
            onClick={function() { setShowCustom(false); }}
            style={{
              background: C.primary, border: "none", borderRadius: 8,
              padding: "6px 16px", color: "#fff", fontWeight: 700,
              fontSize: 13, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif",
              marginLeft: "auto"
            }}>Appliquer</button>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div style={{ padding: "24px 20px 48px" }}>

        {/* SECTION HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 22, background: C.primary, borderRadius: 2 }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "0.01em", fontFamily: "'Josefin Sans', sans-serif" }}>{activeLabel}</h2>
              <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                {showCustom
                  ? customFrom + " → " + customTo
                  : range === "7j"  ? "Derniers 7 jours"
                  : range === "30j" ? "Derniers 30 jours"
                  : range === "90j" ? "Derniers 90 jours"
                  : "Derniere annee"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "6px 12px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>Synchro il y a 4 min</span>
            <span style={{ color: C.faint }}>·</span>
            {["GA4","GSC","Meta","GBP"].map(function(p) {
              return <span key={p} style={{ fontSize: 12, background: "#dcfce7", color: "#16a34a", padding: "1px 6px", borderRadius: 20, fontWeight: 700 }}>{p} ✓</span>;
            })}
          </div>
        </div>

        {renderContent()}

        <div style={{ textAlign: "center", color: C.faint, fontSize: 13, paddingTop: 24, borderTop: "1px solid " + C.border, marginTop: 8 }}>
          agence ocelot · agence web eco-responsable · Connecte tes APIs pour afficher tes vraies metriques
        </div>
      </div>
    </div>
  );
}
