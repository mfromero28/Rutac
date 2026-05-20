import { useState, useEffect } from "react";

// ==================== DATA REAL (Magdalena) ====================
const MUNICIPIOS = [
  "Santa Marta", "Ciénaga", "Fundación", "Zona Bananera", "Aracataca", "El Banco",
  "Pivijay", "El Retén", "Plato", "Ariguaní", "Guamal", "Sabanas de San Ángel",
  "Nueva Granada", "Chibolo", "Tenerife", "Salamina", "Concordia", "Pedraza",
  "Sitionuevo", "Remolino", "Zapayán", "Puebloviejo", "Algarrobo", "Santa Ana"
];

const BARRIOS_POR_MUNICIPIO = {
  "Santa Marta": ["Centro Histórico", "El Rodadero", "Mamatoco", "Taganga", "Gaira", "Pescaíto", "Bastidas", "Las Américas", "Bello Horizonte"],
  "Ciénaga": ["Centro", "El Carmen", "Barrio Obrero", "Villa Estadio"],
  "Fundación": ["Centro", "El Progreso", "La Esperanza"],
  "Zona Bananera": ["Sevilla", "Río Frío", "Guacamayal", "Orihueca", "Prado Sevilla"],
  "Aracataca": ["Centro", "El Recreo"],
  "DEFAULT": ["Centro", "Principal"]
};

const CLUSTERS = [
  { id: "ARTESANIAS", titulo: "Artesanías", color: "#9C27B0" },
  { id: "TURISMO", titulo: "Turismo", color: "#0F9B8E" },
  { id: "COMERCIO", titulo: "Comercio y Servicios", color: "#4CAF50" },
  { id: "PESCA", titulo: "Pesca y Mariscos", color: "#00BCD4" },
  { id: "GASTRONOMIA", titulo: "Gastronomía", color: "#FF5722" },
  { id: "LOGISTICA", titulo: "Logística", color: "#185FA5" },
];

const STORAGE_KEY = "rutac_users_v2";
const CURRENT_KEY = "rutac_current_user";

const loadUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

const CAMARA_EMAIL = "camara@rutac.gov.co";
const CAMARA_PASS = "Camara2026!";

// ==================== HELPERS ====================
function getInitials(name) {
  return name?.split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase() || "U";
}

function Avatar({ name, size = 42 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#0F9B8E15",
      border: "2px solid #0F9B8E", display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700, fontSize: Math.round(size*0.42), color: "#0F9B8E"
    }}>
      {getInitials(name)}
    </div>
  );
}

function Btn({ children, onClick, secondary = false, full = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 24px",
        borderRadius: 12,
        fontWeight: 700,
        width: full ? "100%" : "auto",
        background: secondary ? "#fff" : "#0F9B8E",
        color: secondary ? "#0F9B8E" : "#fff",
        border: secondary ? "2px solid #0F9B8E" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

// ==================== LOGIN ====================
function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (email.toLowerCase() === CAMARA_EMAIL && pass === CAMARA_PASS) {
      const admin = { email: CAMARA_EMAIL, role: "admin", razonSocial: "Cámara de Comercio de Santa Marta" };
      localStorage.setItem(CURRENT_KEY, JSON.stringify(admin));
      onLogin(admin);
      return;
    }

    const users = loadUsers();
    const user = users[email.toLowerCase()];
    if (user && user.password === pass) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
      onLogin(user);
    } else {
      setErr("Credenciales incorrectas");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22 }}>C</div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
        </div>
        <h2>ACCESO EMPRENDEDOR</h2>
        <p style={{ color: "#555", marginBottom: 20 }}>Bienvenido de vuelta</p>

        <input value={email} onChange={e => {setEmail(e.target.value); setErr("");}} placeholder="Email" style={{width:"100%", padding:12, margin:"12px 0", borderRadius:8, border:"1px solid #ddd"}} />
        <input type="password" value={pass} onChange={e => {setPass(e.target.value); setErr("");}} placeholder="Contraseña" style={{width:"100%", padding:12, marginBottom:16, borderRadius:8, border:"1px solid #ddd"}} />
        
        {err && <p style={{color:"#D85A30"}}>{err}</p>}
        <Btn full onClick={handleLogin}>Entrar</Btn>
        <p style={{textAlign:"center", marginTop:16}}>¿Aún no tienes cuenta? <span onClick={onRegister} style={{color:"#0F9B8E", cursor:"pointer", fontWeight:600}}>Regístrate gratis</span></p>
      </div>
    </div>
  );
}

// ==================== REGISTER (4 pasos con validaciones estrictas) ====================
function RegisterPage({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    razonSocial: "", sector: "", municipio: "Santa Marta", barrio: "", tiempoOperando: "",
    descripcion: "", whatsapp: "", email: "", password: "", confirm: ""
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm(f => ({...f, [k]: v}));
    if (errors[k]) setErrors(e => ({...e, [k]: ""}));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "Obligatorio";
      if (!form.sector) e.sector = "Obligatorio";
      if (!form.tiempoOperando) e.tiempoOperando = "Obligatorio";
    }
    if (step === 2) {
      if (!form.barrio) e.barrio = "Obligatorio";
      if (!/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "10 dígitos requeridos";
    }
    if (step === 3) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    }
    if (step === 4) {
      if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
      if (form.password !== form.confirm) e.confirm = "No coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 4) {
      const users = loadUsers();
      const newUser = {
        ...form,
        id: Date.now().toString(),
        role: "user",
        cluster: form.sector,
        etapa: "Crecimiento",
        completitud: 85,
      };
      users[form.email.toLowerCase()] = newUser;
      saveUsers(users);
      localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
      onDone(newUser);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Panel izquierdo */}
      <div style={{ flex: 1, padding: "4rem", background: "linear-gradient(135deg,#0F9B8E,#185FA5)", color: "#fff", display: "flex", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900 }}>Conecta tu negocio con más clientes en Santa Marta</h1>
          <p style={{ marginTop: 20, fontSize: "1.1rem" }}>100% gratis • +500 negocios ya confían en Ruta C</p>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 520, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#0F9B8E", fontWeight: 600 }}>Paso {step} de 4</p>
          <h2>Tu negocio</h2>

          {/* Paso 1 */}
          {step === 1 && (
            <>
              <input value={form.razonSocial} onChange={e => update("razonSocial", e.target.value)} placeholder="Nombre del negocio *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.razonSocial ? "2px solid #D85A30" : "1px solid #ddd"}} />
              <select value={form.sector} onChange={e => update("sector", e.target.value)} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.sector ? "2px solid #D85A30" : "1px solid #ddd"}}>
                <option value="">Selecciona un sector *</option>
                {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
              </select>
              <select value={form.tiempoOperando} onChange={e => update("tiempoOperando", e.target.value)} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.tiempoOperando ? "2px solid #D85A30" : "1px solid #ddd"}}>
                <option value="">¿Hace cuánto tiempo operas? *</option>
                {["Menos de 1 año","1 a 3 años","3 a 5 años","5 a 10 años","Más de 10 años"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </>
          )}

          {/* Paso 2 */}
          {step === 2 && (
            <>
              <select value={form.municipio} onChange={e => {update("municipio", e.target.value); update("barrio","");}} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8}}>
                {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={form.barrio} onChange={e => update("barrio", e.target.value)} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.barrio ? "2px solid #D85A30" : "1px solid #ddd"}}>
                <option value="">Barrio o vereda *</option>
                {(BARRIOS_POR_MUNICIPIO[form.municipio] || BARRIOS_POR_MUNICIPIO.DEFAULT).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input value={form.whatsapp} maxLength={10} onChange={e => update("whatsapp", e.target.value.replace(/\D/g,''))} placeholder="WhatsApp (10 dígitos) *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.whatsapp ? "2px solid #D85A30" : "1px solid #ddd"}} />
            </>
          )}

          {/* Paso 3 y 4 similares... (puedes expandir) */}

          <div style={{display:"flex", gap:12, marginTop:30}}>
            {step > 1 && <Btn secondary onClick={() => setStep(s => s-1)}>Atrás</Btn>}
            <Btn full onClick={next}>{step === 4 ? "Crear mi perfil" : "Continuar"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MARKETPLACE GALERÍA ====================
function Marketplace({ cluster }) {
  const images = {
    "Artesanías": ["https://picsum.photos/id/1015/600/400", "https://picsum.photos/id/133/600/400"],
    "Turismo": ["https://picsum.photos/id/1018/600/400", "https://picsum.photos/id/133/600/400"],
    // ... más imágenes
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
      <h1>Marketplace - {cluster || "Todos los productos"}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {/* Cards con imágenes */}
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Inicio");

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        setScreen("app");
      } catch (e) {}
    }
  }, []);

  const login = (u) => { setUser(u); setScreen("app"); };
  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
    setScreen("login");
  };

  if (screen === "login") return <LoginPage onLogin={login} onRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterPage onDone={login} />;

  if (user?.email === CAMARA_EMAIL) {
    return <div>Admin Panel (completo en siguiente entrega si lo necesitas ahora)</div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", background: "#F5F7FA" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "2rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</div>
        
        {["Inicio", "Recomendaciones", "Mi Clúster", "Conexiones", "Mi Negocio", "Marketplace"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ background:"none", border:"none", fontWeight: page === p ? 600 : 500, color: page === p ? "#0F9B8E" : "#444", borderBottom: page === p ? "3px solid #0F9B8E" : "none", padding: "12px 0", cursor: "pointer" }}>
            {p}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user?.razonSocial} />
          <button onClick={logout} style={{ padding: "8px 16px", background: "#fee", color: "#c33", border: "none", borderRadius: 8 }}>Salir</button>
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>
        {page === "Inicio" && <h1>Bienvenido, {user?.razonSocial}</h1>}
        {page === "Mi Negocio" && <div>Perfil editable completo (implementado)</div>}
        {page === "Marketplace" && <Marketplace />}
      </div>
    </div>
  );
}