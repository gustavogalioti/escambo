import { useState, useEffect } from "react";

// ─── DATA MOCK ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: "Rafael Mendes", city: "São Paulo, SP", avatar: "RM", bio: "Colecionador de eletrônicos e apaixonado por motos.", since: "Jan 2024", trades: 12, rating: 4.8 },
  { id: 2, name: "Camila Torres", city: "Rio de Janeiro, RJ", avatar: "CT", bio: "Adoro decoração vintage e sempre tenho algo pra trocar.", since: "Mar 2024", trades: 7, rating: 4.6 },
  { id: 3, name: "Lucas Ferreira", city: "Curitiba, PR", avatar: "LF", bio: "Gamer e entusiasta de tecnologia.", since: "Jun 2024", trades: 3, rating: 5.0 },
];

const MOCK_PRODUCTS = [
  { id: 1, userId: 1, title: "Honda CB 500F 2021", description: "Moto em excelente estado, 15.000km rodados, toda revisada. Segundo dono, sem débitos.", category: "Veículos", wants: "Carro pequeno, jet ski, ou me surpreenda", emoji: "🏍️", color: "#e8f4fd", badge: "Destaque", views: 234 },
  { id: 2, userId: 2, title: "Telefone Antigo Decorativo", description: "Telefone retrô anos 70, funcional, perfeito para decoração vintage. Estado impecável.", category: "Decoração", wants: "Qualquer item de decoração ou algo que me surpreenda", emoji: "📞", color: "#fef9e7", badge: "", views: 89 },
  { id: 3, userId: 3, title: "PlayStation 5 + 3 Jogos", description: "PS5 com dois controles e os jogos God of War Ragnarok, Spider-Man 2 e Hogwarts Legacy. Pouquíssimo uso.", category: "Eletrônicos", wants: "Notebook gamer, câmera fotográfica ou drone", emoji: "🎮", color: "#f0fff4", badge: "Novo", views: 412 },
  { id: 4, userId: 1, title: "Jet Ski Kawasaki 800cc", description: "Jet ski 2019, motor 800cc, revisado, com carretinha. 120 horas de uso.", category: "Veículos", wants: "Carro, moto, embarcação ou me surpreenda com uma proposta!", emoji: "🚤", color: "#fdf0ff", badge: "Urgente", views: 178 },
  { id: 5, userId: 2, title: "Espelho Veneziano 1,2m", description: "Espelho veneziano grande, moldura trabalhada em folha de ouro, 1,2m x 0,8m. Item de alto valor decorativo.", category: "Decoração", wants: "Itens de cozinha, eletrônicos, joias ou surpreenda-me", emoji: "🪞", color: "#fff5f5", badge: "", views: 56 },
  { id: 6, userId: 3, title: "MacBook Pro M1 2021", description: "MacBook Pro 13' M1, 16GB RAM, 512GB SSD. Bateria 97% saúde. Com capa e carregador.", category: "Eletrônicos", wants: "iPhone 15 Pro, câmera mirrorless, ou proposta criativa", emoji: "💻", color: "#f5f0ff", badge: "Destaque", views: 503 },
];

const MOCK_MESSAGES = [
  { id: 1, from: 2, to: 1, productId: 1, productTitle: "Honda CB 500F 2021", offer: "Espelho Veneziano + R$500 em crédito", status: "pendente", time: "há 2h", avatar: "CT", fromName: "Camila Torres" },
  { id: 2, from: 3, to: 1, productId: 4, productTitle: "Jet Ski Kawasaki 800cc", offer: "PlayStation 5 + 3 Jogos + MacBook Pro M1", status: "aceita", time: "há 1 dia", avatar: "LF", fromName: "Lucas Ferreira" },
  { id: 3, from: 1, to: 3, productId: 6, productTitle: "MacBook Pro M1 2021", offer: "Honda CB 500F 2021", status: "recusada", time: "há 3 dias", avatar: "RM", fromName: "Você (enviada)" },
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #faf8f5;
      --surface: #ffffff;
      --border: #e8e3dc;
      --text: #1a1714;
      --muted: #8a8078;
      --accent: #c8602a;
      --accent-light: #f5e8e0;
      --accent2: #2a6e4a;
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
      --radius: 12px;
      --shadow: 0 2px 16px rgba(26,23,20,0.08);
      --shadow-lg: 0 8px 40px rgba(26,23,20,0.14);
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

    button { cursor: pointer; border: none; font-family: var(--font-body); }

    input, textarea, select {
      font-family: var(--font-body);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 16px;
      background: var(--surface);
      color: var(--text);
      width: 100%;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus { border-color: var(--accent); }

    .btn-primary {
      background: var(--accent);
      color: #fff;
      padding: 13px 28px;
      border-radius: var(--radius);
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: background 0.2s, transform 0.1s;
    }
    .btn-primary:hover { background: #b3521f; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      background: transparent;
      color: var(--accent);
      padding: 11px 24px;
      border-radius: var(--radius);
      font-size: 15px;
      font-weight: 500;
      border: 1.5px solid var(--accent);
      transition: background 0.2s;
    }
    .btn-outline:hover { background: var(--accent-light); }

    .btn-ghost {
      background: transparent;
      color: var(--muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s, color 0.2s;
    }
    .btn-ghost:hover { background: var(--border); color: var(--text); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    .fade-in { animation: fadeIn 0.4s ease both; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  `}</style>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, loggedIn, setLoggedIn, user }) {
  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1.5px solid var(--border)",
      padding: "0 32px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 8px rgba(26,23,20,0.06)"
    }}>
      <button onClick={() => setPage(loggedIn ? "home" : "landing")} style={{
        fontFamily: "var(--font-display)",
        fontSize: 26,
        fontWeight: 900,
        color: "var(--accent)",
        background: "none",
        border: "none",
        cursor: "pointer",
        letterSpacing: "-0.02em"
      }}>
        ESCAMBO
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!loggedIn ? (
          <>
            <button className="btn-ghost" onClick={() => setPage("how")}>Como Funciona</button>
            <button className="btn-outline" onClick={() => setPage("landing")}>Entrar</button>
            <button className="btn-primary" onClick={() => setPage("landing")}>Cadastrar</button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => setPage("vitrine")}>Vitrine</button>
            <button className="btn-ghost" onClick={() => setPage("profile")}>Perfil</button>
            <button className="btn-outline" onClick={() => { setLoggedIn(false); setPage("landing"); }} style={{ padding: "8px 16px", fontSize: 14 }}>Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ setPage, setLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });

  const handleAuth = () => {
    setLoggedIn(true);
    setPage("home");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a1714 0%, #2d2520 60%, #3d2e1e 100%)",
        padding: "80px 32px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px"
        }} />
        <div className="fade-in" style={{ position: "relative" }}>
          <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
            A nova forma de trocar
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 7vw, 82px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 20
          }}>
            ESCAMBO
          </h1>
          <p style={{ color: "#c4b8a8", fontSize: 18, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Poste o que você tem. Receba propostas do que você nunca imaginou querer.
          </p>
        </div>
      </div>

      {/* Auth Box */}
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
        <div className="fade-in" style={{
          background: "var(--surface)",
          borderRadius: 20,
          boxShadow: "var(--shadow-lg)",
          border: "1.5px solid var(--border)",
          padding: 40,
          width: "100%",
          maxWidth: 420,
          animationDelay: "0.1s"
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "var(--bg)", borderRadius: 10, padding: 4, marginBottom: 32 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                background: mode === m ? "var(--surface)" : "transparent",
                color: mode === m ? "var(--accent)" : "var(--muted)",
                boxShadow: mode === m ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s"
              }}>
                {m === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && (
              <>
                <input placeholder="Seu nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Sua cidade" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </>
            )}
            <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button className="btn-primary" onClick={handleAuth} style={{ marginTop: 6, width: "100%", padding: "14px 0", fontSize: 16 }}>
              {mode === "login" ? "Entrar no Escambo" : "Criar minha conta"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{
              color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13
            }}>
              {mode === "login" ? "Cadastre-se grátis" : "Faça login"}
            </button>
          </p>
        </div>
      </div>

      {/* How it works preview */}
      <div style={{ padding: "0 32px 80px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, textAlign: "center", marginBottom: 40, color: "var(--text)" }}>
          Como funciona o Escambo?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {[
            { step: "01", title: "Poste o que você tem", desc: "Fotos, descrição e o que você gostaria em troca. Sem complicação.", emoji: "📦" },
            { step: "02", title: "Receba propostas", desc: "Outros usuários mandam o que têm para oferecer. Pode ser qualquer coisa.", emoji: "💬" },
            { step: "03", title: "Feche o negócio", desc: "Achou interessante? Combinam os detalhes e fazem a troca.", emoji: "🤝" },
          ].map(({ step, title, desc, emoji }) => (
            <div key={step} style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 28,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", marginBottom: 8 }}>PASSO {step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOME (pós-login) ─────────────────────────────────────────────────────────
function Home({ setPage, setSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearch(query.trim());
      setPage("vitrine");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      {/* Search first */}
      <div className="fade-in" style={{ width: "100%", maxWidth: 600, marginBottom: 56 }}>
        <p style={{ textAlign: "center", color: "var(--muted)", fontWeight: 500, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          O que você está buscando?
        </p>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 10 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex: moto, notebook, câmera..."
            style={{ flex: 1, fontSize: 16, padding: "14px 20px", borderRadius: 12 }}
          />
          <button type="submit" className="btn-primary" style={{ padding: "14px 24px", borderRadius: 12, whiteSpace: "nowrap" }}>
            Buscar →
          </button>
        </form>
      </div>

      {/* Two main options */}
      <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%", maxWidth: 620, animationDelay: "0.1s" }}>
        <button onClick={() => setPage("advertise")} style={{
          background: "var(--accent)",
          color: "#fff",
          borderRadius: 20,
          padding: "40px 28px",
          textAlign: "center",
          border: "none",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 20px rgba(200,96,42,0.3)"
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(200,96,42,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(200,96,42,0.3)"; }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Anunciar Algo</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>Poste o que você tem e receba propostas de troca</p>
        </button>

        <button onClick={() => setPage("vitrine")} style={{
          background: "var(--surface)",
          color: "var(--text)",
          borderRadius: 20,
          padding: "40px 28px",
          textAlign: "center",
          border: "2px solid var(--border)",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 10, color: "var(--text)" }}>Encontrar Algo</h2>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>Navegue pela vitrine e descubra o que está disponível</p>
        </button>
      </div>

      <p className="fade-in" style={{ marginTop: 40, color: "var(--muted)", fontSize: 14, animationDelay: "0.2s" }}>
        {MOCK_PRODUCTS.length} itens disponíveis para troca agora
      </p>
    </div>
  );
}

// ─── VITRINE ──────────────────────────────────────────────────────────────────
function Vitrine({ setPage, setSelectedProduct, initialSearch, setSearch }) {
  const [query, setQuery] = useState(initialSearch || "");
  const [category, setCategory] = useState("Todos");

  const categories = ["Todos", "Veículos", "Eletrônicos", "Decoração"];

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === "Todos" || p.category === category;
    return matchQuery && matchCat;
  });

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setPage("product");
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div className="fade-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, marginBottom: 6 }}>Vitrine</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Explore tudo que está disponível para trocar</p>
      </div>

      {/* Filters */}
      <div className="fade-in" style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", animationDelay: "0.05s" }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setSearch(e.target.value); }}
          placeholder="🔍  Pesquisar na vitrine..."
          style={{ flex: 1, minWidth: 200, maxWidth: 360 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: category === c ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              background: category === c ? "var(--accent-light)" : "var(--surface)",
              color: category === c ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.15s"
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 16 }}>Nenhum item encontrado para "<strong>{query}</strong>"</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} onOpen={handleOpen} delay={i * 0.04} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product: p, onOpen, delay = 0 }) {
  const user = MOCK_USERS.find(u => u.id === p.userId);
  return (
    <div
      className="fade-in"
      onClick={() => onOpen(p)}
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        animationDelay: `${delay}s`
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      {/* Image area */}
      <div style={{
        height: 160,
        background: p.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 72,
        position: "relative"
      }}>
        {p.emoji}
        {p.badge && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: p.badge === "Urgente" ? "#e53e3e" : p.badge === "Novo" ? "var(--accent2)" : "var(--accent)",
            color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em"
          }}>{p.badge}</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          {p.category}
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {p.description}
        </p>
        <div style={{
          background: "var(--bg)", borderRadius: 8, padding: "10px 12px",
          fontSize: 12, color: "var(--muted)", lineHeight: 1.4
        }}>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>🔄 Quer trocar por: </span>
          {p.wants}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700
            }}>{user?.avatar}</div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{user?.name}</span>
          </div>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>👁 {p.views}</span>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ product, setPage, loggedIn }) {
  const [showProposal, setShowProposal] = useState(false);
  const [offerText, setOfferText] = useState("");
  const [sent, setSent] = useState(false);
  const user = MOCK_USERS.find(u => u.id === product.userId);

  const handleSend = () => {
    if (offerText.trim()) {
      setSent(true);
      setShowProposal(false);
    }
  };

  if (!product) return null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => setPage("vitrine")} className="btn-ghost" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        ← Voltar à vitrine
      </button>

      <div className="fade-in" style={{ background: "var(--surface)", borderRadius: 20, border: "1.5px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
        {/* Image */}
        <div style={{
          height: 300,
          background: product.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 120,
          position: "relative"
        }}>
          {product.emoji}
          {product.badge && (
            <span style={{
              position: "absolute", top: 20, right: 20,
              background: product.badge === "Urgente" ? "#e53e3e" : product.badge === "Novo" ? "var(--accent2)" : "var(--accent)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              padding: "5px 16px", borderRadius: 20
            }}>{product.badge}</span>
          )}
        </div>

        <div style={{ padding: "32px 40px 40px" }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            {product.category} · 👁 {product.views} visualizações
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, marginBottom: 16, lineHeight: 1.15 }}>{product.title}</h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

          <div style={{
            background: "var(--accent-light)",
            border: "1.5px solid var(--accent)",
            borderRadius: 14,
            padding: "18px 22px",
            marginBottom: 32
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              🔄 O que o dono gostaria em troca
            </p>
            <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6 }}>{product.wants}</p>
          </div>

          {/* Owner */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)", marginBottom: 28 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700
            }}>{user?.avatar}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{user?.name}</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>{user?.city} · ⭐ {user?.rating} · {user?.trades} trocas realizadas</p>
            </div>
          </div>

          {sent ? (
            <div style={{
              background: "#f0fff4", border: "1.5px solid var(--accent2)",
              borderRadius: 14, padding: "18px 22px", textAlign: "center"
            }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--accent2)" }}>✅ Proposta enviada!</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Você pode acompanhar em Perfil → Minhas Mensagens</p>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setShowProposal(!showProposal)} style={{ width: "100%", padding: "16px 0", fontSize: 17 }}>
              💬 Mandar Proposta de Troca
            </button>
          )}

          {/* Proposal box */}
          {showProposal && !sent && (
            <div className="fade-in" style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>
                O que você tem para oferecer em troca?
              </label>
              <textarea
                value={offerText}
                onChange={e => setOfferText(e.target.value)}
                placeholder="Ex: Tenho um MacBook Pro M1, 2021, 16GB RAM. Aceita trocar?"
                rows={4}
                style={{ resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button className="btn-primary" onClick={handleSend} style={{ flex: 1, padding: "13px 0" }}>Enviar Proposta</button>
                <button className="btn-ghost" onClick={() => setShowProposal(false)} style={{ flex: 1, padding: "13px 0" }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADVERTISE ────────────────────────────────────────────────────────────────
function Advertise({ setPage }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Eletrônicos", wants: "" });
  const [published, setPublished] = useState(false);

  const categories = ["Eletrônicos", "Veículos", "Decoração", "Moda", "Esporte", "Outros"];

  const handlePublish = () => {
    if (form.title && form.description && form.wants) setPublished(true);
  };

  if (published) {
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="fade-in" style={{
          background: "var(--surface)", borderRadius: 20, padding: 48,
          border: "1.5px solid var(--border)", boxShadow: "var(--shadow)"
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Anúncio publicado!</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            Seu item está na vitrine. Aguarde as propostas — pode vir muita coisa boa!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => setPage("vitrine")}>Ver na Vitrine</button>
            <button className="btn-outline" onClick={() => { setPublished(false); setForm({ title: "", description: "", category: "Eletrônicos", wants: "" }); }}>Novo Anúncio</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => setPage("home")} className="btn-ghost" style={{ marginBottom: 24 }}>← Voltar</button>

      <div className="fade-in">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 900, marginBottom: 6 }}>Anunciar um item</h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 15 }}>Mostre o que você tem. As propostas chegam até você.</p>
      </div>

      <div className="fade-in" style={{ background: "var(--surface)", borderRadius: 20, border: "1.5px solid var(--border)", padding: 36, animationDelay: "0.1s" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>FOTOS DO ITEM</label>
            <div style={{
              border: "2px dashed var(--border)",
              borderRadius: 14,
              padding: 32,
              textAlign: "center",
              cursor: "pointer",
              color: "var(--muted)",
              fontSize: 14,
              transition: "border-color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Clique para adicionar fotos</p>
              <p style={{ fontSize: 12 }}>Até 8 fotos · JPG, PNG</p>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>CATEGORIA</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>TÍTULO DO ITEM *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Honda CB 500F 2021" />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>DESCRIÇÃO *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descreva o estado do item, histórico, características..." rows={4} style={{ resize: "vertical" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>O QUE VOCÊ GOSTARIA EM TROCA? *</label>
            <textarea value={form.wants} onChange={e => setForm({ ...form, wants: e.target.value })} placeholder="Seja específico ou aberto — ex: 'moto, câmera, ou me surpreenda com uma proposta!'" rows={3} style={{ resize: "vertical" }} />
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
              💡 Dica: ser aberto a propostas aumenta as chances de uma troca incrível!
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handlePublish}
            style={{
              width: "100%", padding: "16px 0", fontSize: 16,
              opacity: (form.title && form.description && form.wants) ? 1 : 0.5
            }}
          >
            Publicar na Vitrine
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile() {
  const [tab, setTab] = useState("ads");
  const user = MOCK_USERS[0];
  const myProducts = MOCK_PRODUCTS.filter(p => p.userId === 1);

  const statusColor = { pendente: "#d97706", aceita: "#16a34a", recusada: "#dc2626" };
  const statusLabel = { pendente: "Pendente", aceita: "Aceita ✓", recusada: "Recusada" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "flex", gap: 32, flexWrap: "wrap" }}>
      {/* Sidebar */}
      <div className="fade-in" style={{ width: 220, flexShrink: 0 }}>
        <div style={{ background: "var(--surface)", borderRadius: 16, border: "1.5px solid var(--border)", padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--accent)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, margin: "0 auto 14px"
          }}>{user.avatar}</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{user.city}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 18 }}>{user.trades}</p>
              <p style={{ fontSize: 11, color: "var(--muted)" }}>Trocas</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 18 }}>⭐{user.rating}</p>
              <p style={{ fontSize: 11, color: "var(--muted)" }}>Nota</p>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--surface)", borderRadius: 16, border: "1.5px solid var(--border)", overflow: "hidden" }}>
          {[{ key: "ads", icon: "📦", label: "Meus Anúncios" }, { key: "messages", icon: "💬", label: "Minhas Mensagens" }].map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{
              width: "100%", padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 10,
              background: tab === item.key ? "var(--accent-light)" : "transparent",
              color: tab === item.key ? "var(--accent)" : "var(--text)",
              fontWeight: tab === item.key ? 600 : 400,
              fontSize: 14,
              borderLeft: tab === item.key ? "3px solid var(--accent)" : "3px solid transparent",
              textAlign: "left",
              transition: "all 0.15s",
              border: "none",
              borderBottom: "1px solid var(--border)",
              cursor: "pointer"
            }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="fade-in" style={{ flex: 1, minWidth: 300, animationDelay: "0.1s" }}>
        {tab === "ads" ? (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Meus Anúncios</h2>
            {myProducts.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>Você ainda não tem anúncios.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {myProducts.map(p => (
                  <div key={p.id} style={{
                    background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderRadius: 14, padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 16
                  }}>
                    <div style={{ fontSize: 36, width: 56, height: 56, background: p.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>{p.category} · 👁 {p.views} visualizações</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "var(--accent-light)", color: "var(--accent)", padding: "4px 10px", borderRadius: 20 }}>Ativo</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Minhas Mensagens</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {MOCK_MESSAGES.map(msg => (
                <div key={msg.id} style={{
                  background: "var(--surface)", border: "1.5px solid var(--border)",
                  borderRadius: 14, padding: "18px 22px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "var(--accent)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700
                      }}>{msg.avatar}</div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{msg.fromName}</p>
                        <p style={{ fontSize: 12, color: "var(--muted)" }}>{msg.time}</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                      background: msg.status === "aceita" ? "#dcfce7" : msg.status === "recusada" ? "#fee2e2" : "#fef9c3",
                      color: statusColor[msg.status]
                    }}>
                      {statusLabel[msg.status]}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
                    Referente a: <strong style={{ color: "var(--text)" }}>{msg.productTitle}</strong>
                  </p>
                  <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text)" }}>
                    <strong>Proposta:</strong> {msg.offer}
                  </div>
                  {msg.status === "pendente" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn-primary" style={{ flex: 1, padding: "10px 0", fontSize: 13 }}>✓ Aceitar</button>
                      <button className="btn-outline" style={{ flex: 1, padding: "10px 0", fontSize: 13 }}>✕ Recusar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
      <div className="fade-in" style={{ textAlign: "center", marginBottom: 60 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 900, marginBottom: 16 }}>Como o Escambo funciona</h1>
        <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
          Sem dinheiro, sem complicação. Só o prazer de trocar uma coisa por outra — e ser surpreendido.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {[
          { n: "01", title: "Crie sua conta gratuitamente", desc: "Em menos de um minuto você já pode postar e receber propostas." },
          { n: "02", title: "Poste o que você quer trocar", desc: "Adicione fotos, descreva bem o item e diga o que você gostaria em troca. Pode ser específico ou aberto — quanto mais aberto, mais surpresas." },
          { n: "03", title: "Navegue pela vitrine", desc: "Veja o que outras pessoas estão trocando. Achou algo interessante? Mande sua proposta com o que você tem para oferecer." },
          { n: "04", title: "Negocie e feche o negócio", desc: "Se a proposta fizer sentido, ambos combinam os detalhes e fazem a troca. Sem taxas, sem intermediários." },
        ].map(({ n, title, desc }) => (
          <div key={n} className="fade-in" style={{
            display: "flex", gap: 24, alignItems: "flex-start",
            background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: 16, padding: "24px 28px"
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900,
              flexShrink: 0
            }}>{n}</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");

  const renderPage = () => {
    switch (page) {
      case "landing": return <Landing setPage={setPage} setLoggedIn={setLoggedIn} />;
      case "home": return <Home setPage={setPage} setSearch={setSearch} />;
      case "vitrine": return <Vitrine setPage={setPage} setSelectedProduct={setSelectedProduct} initialSearch={search} setSearch={setSearch} />;
      case "product": return <ProductPage product={selectedProduct} setPage={setPage} loggedIn={loggedIn} />;
      case "advertise": return <Advertise setPage={setPage} />;
      case "profile": return <Profile setPage={setPage} />;
      case "how": return <HowItWorks />;
      default: return <Landing setPage={setPage} setLoggedIn={setLoggedIn} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Navbar page={page} setPage={setPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main>{renderPage()}</main>
    </>
  );
}
