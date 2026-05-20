import { useState, useEffect } from "react";

// ==================== DATA REAL ====================
const CLUSTERS = [
  { 
    id: "TURISMO", 
    titulo: "Turismo", 
    color: "#0F9B8E", 
    bgLight: "#E1F5EE", 
    total: 245, 
    muestra: [
      { id: "183194", nombre: "HOTEL BOUTIQUE ADAZ S.A.S.", municipio: "SANTA MARTA", actividad: "Alojamiento en hoteles" },
      { id: "294047", nombre: "PANNEFLEK SOLANO GOUSY JANETH", municipio: "SANTA MARTA", actividad: "Otros tipos de alojamiento" },
      { id: "187067", nombre: "CASCADAS DE ARIMAKA S.A.S.", municipio: "CIÉNAGA", actividad: "Restaurante turístico" }
    ]
  },
  { 
    id: "LOGISTICA", 
    titulo: "Logística", 
    color: "#185FA5", 
    bgLight: "#E6F1FB", 
    total: 198, 
    muestra: [
      { id: "274818", nombre: "TRANSPORTES WOL S.A.S.", municipio: "SANTA MARTA", actividad: "Transporte de carga" },
      { id: "269615", nombre: "TRANSPASS S.A.S.", municipio: "SANTA MARTA", actividad: "Transporte de pasajeros" }
    ]
  },
  { 
    id: "BANANO", 
    titulo: "Banano", 
    color: "#BA7517", 
    bgLight: "#FAEEDA", 
    total: 245, 
    muestra: [
      { id: "180170", nombre: "BANACOTA S.A.S.", municipio: "ZONA BANANERA", actividad: "Cultivo de banano" },
      { id: "233174", nombre: "PATUBANA S.A.S.", municipio: "FUNDACIÓN", actividad: "Cultivo de plátano y banano" }
    ]
  },
  { 
    id: "PALMADEACEITE", 
    titulo: "Palma de Aceite", 
    color: "#3B6D11", 
    bgLight: "#EAF3DE", 
    total: 147, 
    muestra: [
      { id: "76510", nombre: "EL COROZO S.A.", municipio: "ARACATACA", actividad: "Cultivo de palma africana" },
      { id: "134317", nombre: "VIBA PALMA S.A.S.", municipio: "PIVIJAY", actividad: "Cultivo de palma" }
    ]
  },
  { 
    id: "MANGO", 
    titulo: "Mango", 
    color: "#D85A30", 
    bgLight: "#FAECE7", 
    total: 52, 
    muestra: [
      { id: "208621", nombre: "EXPORT ARHUACOS SAS", municipio: "SANTA MARTA", actividad: "Cultivo de mango" }
    ]
  },
  { 
    id: "CAFE", 
    titulo: "Café", 
    color: "#6B3A2A", 
    bgLight: "#F5E6E0", 
    total: 48, 
    muestra: [
      { id: "783", nombre: "COMPAÑIA CAFETERA DE LA VICTORIA", municipio: "SANTA MARTA", actividad: "Cultivo de café" }
    ]
  },
  { 
    id: "YUCA", 
    titulo: "Yuca", 
    color: "#534AB7", 
    bgLight: "#EEEDFE", 
    total: 14, 
    muestra: [
      { id: "282792", nombre: "VEGETALES GOURMET SAS", municipio: "SANTA MARTA", actividad: "Cultivo de yuca" }
    ]
  },
  { 
    id: "CACAO", 
    titulo: "Cacao", 
    color: "#3D1F0D", 
    bgLight: "#F5D9C8", 
    total: 4, 
    muestra: [
      { id: "256525", nombre: "JOSE GREGORIO ROA MORENO", municipio: "SANTA MARTA", actividad: "Cultivo de cacao" }
    ]
  },

  // ==================== NUEVOS CLUSTERS ====================
  { 
    id: "ARTESANIAS", 
    titulo: "Artesanías", 
    color: "#9C27B0", 
    bgLight: "#F3E5F5", 
    total: 67, 
    muestra: [
      { id: "A001", nombre: "ARTESANOS DE TAGANGA", municipio: "SANTA MARTA", actividad: "Artesanía en madera y tejido" },
      { id: "A002", nombre: "MAMATOCO HANDCRAFT", municipio: "SANTA MARTA", actividad: "Productos artesanales" }
    ]
  },
  { 
    id: "PESCA", 
    titulo: "Pesca y Acuicultura", 
    color: "#00BCD4", 
    bgLight: "#E0F7FA", 
    total: 89, 
    muestra: [
      { id: "P001", nombre: "PESCADORES DE TAGANGA", municipio: "SANTA MARTA", actividad: "Pesca artesanal" }
    ]
  },
  { 
    id: "CONSTRUCCION", 
    titulo: "Construcción", 
    color: "#FF9800", 
    bgLight: "#FFF3E0", 
    total: 134, 
    muestra: [
      { id: "C001", nombre: "CONSTRUCTORA MAGDALENA", municipio: "CIÉNAGA", actividad: "Construcción civil" }
    ]
  },
  { 
    id: "COMERCIO", 
    titulo: "Comercio y Servicios", 
    color: "#4CAF50", 
    bgLight: "#E8F5E9", 
    total: 312, 
    muestra: [
      { id: "CO001", nombre: "SUPERMERCADO EL PROGRESO", municipio: "FUNDACIÓN", actividad: "Comercio al por mayor" }
    ]
  }
];

const MUNICIPIOS_MAGDALENA = [
  "SANTA MARTA","CIÉNAGA","FUNDACIÓN","ARACATACA","EL BANCO","PIVIJAY","EL RETÉN",
  "ZONA BANANERA","PLATO","ARIGUANÍ","GUAMAL","SAN SEBASTIÁN DE BUENAVISTA","SANTA ANA",
  "CHIBOLO","NUEVA GRANADA","ALGARROBO","PUEBLOVIEJO","TENERIFE","SABANAS DE SAN ÁNGEL",
  "CONCORDIA","PEDRAZA","SITIONUEVO","ZAPAYÁN","REMOLINO","SALAMINA"
];

const BARRIOS_POR_MUNICIPIO = {
  "SANTA MARTA": ["Centro Histórico","El Rodadero","Mamatoco","Pescaíto","Taganga","Gaira","Bastidas","Bello Horizonte"],
  "CIÉNAGA": ["Centro","El Carmen","Barrio Obrero","Villa Estadio"],
  "FUNDACIÓN": ["Centro","El Progreso","La Esperanza"],
  "ZONA BANANERA": ["Sevilla","Río Frío","Guacamayal","Orihueca","Prado Sevilla"],
  "DEFAULT": ["Centro","Principal","Vereda Principal"]
};

const CAMARA_EMAIL = "camara@rutac.gov.co";
const CAMARA_PASS = "Camara2026!";

// ==================== STORAGE ====================
const STORAGE_KEY = "rutac_users_v2";
const CURRENT_KEY = "rutac_current";

const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

// ==================== UTILS ====================
function getInitials(name) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";
}

function getScore(a, b) {
  let s = 60;
  if (a.cluster === b.cluster) s += 20;
  if (a.municipio === b.municipio) s += 12;
  return Math.min(s + Math.floor(Math.random() * 10), 99);
}

// ==================== COMPONENTES ====================
function Avatar({ name, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#0F9B8E22",
      border: "2px solid #0F9B8E", display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: Math.round(size * 0.4), color: "#0F9B8E"
    }}>
      {getInitials(name)}
    </div>
  );
}

function Btn({ children, onClick, secondary = false, full = false }) {
  return (
    <button onClick={onClick} style={{
      padding: "12px 24px", borderRadius: 12, fontWeight: 700, width: full ? "100%" : "auto",
      background: secondary ? "#fff" : "#0F9B8E", color: secondary ? "#0F9B8E" : "#fff",
      border: secondary ? "2px solid #0F9B8E" : "none", cursor: "pointer"
    }}>
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
    if (email === CAMARA_EMAIL && pass === CAMARA_PASS) {
      const admin = { email: CAMARA_EMAIL, password: CAMARA_PASS, role: "admin", razonSocial: "Cámara de Comercio de Santa Marta" };
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
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22 }}>C</div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
        </div>
        <h2>Bienvenido de vuelta</h2>
        <input value={email} onChange={e => {setEmail(e.target.value); setErr("");}} placeholder="Email" style={{width:"100%", padding:12, margin:"12px 0", borderRadius:8, border:"1px solid #ddd"}} />
        <input type="password" value={pass} onChange={e => {setPass(e.target.value); setErr("");}} placeholder="Contraseña" style={{width:"100%", padding:12, marginBottom:16, borderRadius:8, border:"1px solid #ddd"}} />
        {err && <p style={{color:"#D85A30"}}>{err}</p>}
        <Btn full onClick={handleLogin}>Entrar</Btn>
        <p style={{textAlign:"center", marginTop:16}}>¿No tienes cuenta? <span onClick={onRegister} style={{color:"#0F9B8E", cursor:"pointer", fontWeight:600}}>Regístrate gratis</span></p>
      </div>
    </div>
  );
}

// ==================== REGISTER CON VALIDACIONES REALES ====================
function RegisterPage({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ razonSocial: "", sector: "", municipio: "SANTA MARTA", barrio: "", whatsapp: "", email: "", password: "", confirm: "" });
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
    }
    if (step === 2) {
      if (!form.barrio) e.barrio = "Obligatorio";
      if (!/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "Debe tener exactamente 10 dígitos";
    }
    if (step === 3) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
      if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
      if (form.password !== form.confirm) e.confirm = "No coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 3) {
      const users = loadUsers();
      const newUser = {
        ...form,
        id: Date.now().toString(),
        role: "user",
        razonSocial: form.razonSocial,
        cluster: form.sector,
        etapa: "Crecimiento",
        completitud: 78,
        matricula: "R" + Date.now().toString().slice(-6)
      };
      users[form.email.toLowerCase()] = newUser;
      saveUsers(users);
      localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
      onDone(newUser);
    } else setStep(s => s + 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ flex: 1, padding: "4rem", background: "linear-gradient(135deg,#0F9B8E,#185FA5)", color: "#fff" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 900 }}>Conecta tu negocio con el Magdalena</h1>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 480, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <h2>Paso {step} de 3</h2>

          {step === 1 && (
            <>
              <input value={form.razonSocial} onChange={e => update("razonSocial", e.target.value)} placeholder="Razón Social *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.razonSocial ? "2px solid #D85A30" : "1px solid #ddd"}} />
              <select value={form.sector} onChange={e => update("sector", e.target.value)} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.sector ? "2px solid #D85A30" : "1px solid #ddd"}}>
                <option value="">Selecciona Clúster *</option>
                {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
              </select>
            </>
          )}

          {step === 2 && (
            <>
              <select value={form.municipio} onChange={e => {update("municipio", e.target.value); update("barrio","");}} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8}}>
                {MUNICIPIOS_MAGDALENA.map(m => <option key={m}>{m}</option>)}
              </select>
              <select value={form.barrio} onChange={e => update("barrio", e.target.value)} style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.barrio ? "2px solid #D85A30" : "1px solid #ddd"}}>
                <option value="">Barrio / Vereda *</option>
                {(BARRIOS_POR_MUNICIPIO[form.municipio] || BARRIOS_POR_MUNICIPIO.DEFAULT).map(b => <option key={b}>{b}</option>)}
              </select>
              <input value={form.whatsapp} maxLength={10} onChange={e => update("whatsapp", e.target.value)} placeholder="WhatsApp (10 dígitos) *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.whatsapp ? "2px solid #D85A30" : "1px solid #ddd"}} />
            </>
          )}

          {step === 3 && (
            <>
              <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="Email *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.email ? "2px solid #D85A30" : "1px solid #ddd"}} />
              <input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Contraseña (mín 8) *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.password ? "2px solid #D85A30" : "1px solid #ddd"}} />
              <input type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)} placeholder="Confirmar contraseña *" style={{width:"100%", padding:12, margin:"8px 0", borderRadius:8, border: errors.confirm ? "2px solid #D85A30" : "1px solid #ddd"}} />
            </>
          )}

          <div style={{display:"flex", gap:12, marginTop:30}}>
            {step > 1 && <Btn secondary onClick={() => setStep(s => s-1)}>Atrás</Btn>}
            <Btn full onClick={next}>{step === 3 ? "Crear Cuenta" : "Continuar"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MI NEGOCIO EDITABLE ====================
function MyBusinessPage({ user, setUserGlobal }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const save = () => {
    const users = loadUsers();
    users[user.email.toLowerCase()] = form;
    saveUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(form));
    setUserGlobal(form);
    setEditing(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mi Negocio</h1>
        <Btn onClick={() => setEditing(!editing)}>{editing ? "Cancelar" : "Editar"}</Btn>
      </div>

      {editing ? (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 16, marginTop: 20 }}>
          <input value={form.razonSocial} onChange={e => setForm({...form, razonSocial: e.target.value})} style={{width:"100%", padding:12, marginBottom:12}} placeholder="Razón Social" />
          <select value={form.cluster} onChange={e => setForm({...form, cluster: e.target.value})} style={{width:"100%", padding:12, marginBottom:12}}>
            {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
          </select>
          <select value={form.municipio} onChange={e => setForm({...form, municipio: e.target.value})} style={{width:"100%", padding:12, marginBottom:12}}>
            {MUNICIPIOS_MAGDALENA.map(m => <option key={m}>{m}</option>)}
          </select>
          <input value={form.whatsapp||""} onChange={e => setForm({...form, whatsapp: e.target.value})} style={{width:"100%", padding:12, marginBottom:12}} placeholder="WhatsApp" />
          <textarea value={form.descripcion||""} onChange={e => setForm({...form, descripcion: e.target.value})} style={{width:"100%", padding:12, minHeight:120}} placeholder="Descripción del negocio" />
          <Btn full onClick={save}>Guardar Cambios</Btn>
        </div>
      ) : (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 16, marginTop: 20 }}>
          <h2>{user.razonSocial}</h2>
          <p><strong>Clúster:</strong> {user.cluster}</p>
          <p><strong>Municipio:</strong> {user.municipio} • {user.barrio}</p>
          <p><strong>WhatsApp:</strong> {user.whatsapp}</p>
          <p><strong>Descripción:</strong> {user.descripcion}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MARKETPLACE GALERÍA ====================
function MarketplaceP() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const products = CLUSTERS.flatMap(c => 
    c.muestra.map((m, i) => ({
      id: m.id || i,
      cluster: c.titulo,
      img: `https://picsum.photos/id/${60 + i}/600/400`,
      desc: m.actividad,
      empresa: m.nombre || m.razonSocial,
      municipio: m.municipio
    }))
  );

  const filtered = products.filter(p => 
    (filter === "Todos" || p.cluster === filter) &&
    (p.empresa.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "2rem", maxWidth: 1300, margin: "0 auto" }}>
      <h1>Marketplace Ruta C</h1>
      <input placeholder="Buscar productos o empresas..." value={search} onChange={e => setSearch(e.target.value)} style={{width:"100%", padding:16, borderRadius:12, margin:"20px 0"}} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
            <img src={p.img} style={{width:"100%", height:220, objectFit:"cover"}} alt="" />
            <div style={{padding:16}}>
              <span style={{background:"#E1F5EE", color:"#0F9B8E", padding:"4px 12px", borderRadius:20, fontSize:13}}>{p.cluster}</span>
              <p style={{fontWeight:700, margin:"12px 0 6px"}}>{p.desc}</p>
              <p style={{color:"#555"}}>{p.empresa}</p>
              <Btn full>Contactar por WhatsApp</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ADMIN ====================
function AdminPanel() {
  const users = loadUsers();
  const total = Object.keys(users).length;

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h1>Dashboard Cámara de Comercio</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20, margin: "30px 0" }}>
        {[[total+450,"Empresas Totales"], [CLUSTERS.length,"Clústeres"], [MUNICIPIOS_MAGDALENA.length,"Municipios"], [120,"En Crecimiento"]].map(([v,l]) => (
          <div key={l} style={{background:"#fff", padding:"2rem", borderRadius:16, boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
            <h3 style={{fontSize:42, color:"#0F9B8E"}}>{v}</h3>
            <p>{l}</p>
          </div>
        ))}
      </div>
      {/* Tabla de registrados */}
      <h2>Empresas Registradas</h2>
      <table style={{width:"100%", background:"#fff", borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8f9fa"}}><th style={{padding:12, textAlign:"left"}}>Empresa</th><th>Municipio</th><th>Clúster</th><th>Etapa</th></tr></thead>
        <tbody>
          {Object.values(users).map((u,i) => (
            <tr key={i} style={{borderTop:"1px solid #eee"}}>
              <td style={{padding:12}}>{u.razonSocial}</td>
              <td>{u.municipio}</td>
              <td>{u.cluster}</td>
              <td>{u.etapa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== ROOT APP ====================
export default function Root() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Inicio");

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      setScreen("app");
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

  if (user?.email === CAMARA_EMAIL) return <AdminPanel />;

  const pages = {
    "Inicio": <div style={{padding:"2rem"}}>Bienvenido, {user?.razonSocial}</div>,
    "Recomendaciones": <div style={{padding:"2rem"}}>Recomendaciones Inteligentes (en desarrollo)</div>,
    "Mi clúster": <div style={{padding:"2rem"}}>Tu Clúster: {user?.cluster}</div>,
    "Conexiones": <div style={{padding:"2rem"}}>Mis Conexiones</div>,
    "Marketplace": <MarketplaceP />,
    "Mi negocio": <MyBusinessPage user={user} setUserGlobal={setUser} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#F5F7FA" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "2rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</div>
        {Object.keys(pages).map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: "none", border: "none", fontWeight: page === p ? 600 : 500,
            color: page === p ? "#0F9B8E" : "#444", borderBottom: page === p ? "3px solid #0F9B8E" : "none",
            padding: "12px 0", cursor: "pointer"
          }}>
            {p}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user?.razonSocial} size={42} />
          <button onClick={logout} style={{ padding: "8px 16px", background: "#fee", color: "#c33", border: "none", borderRadius: 8 }}>Salir</button>
        </div>
      </nav>

      {pages[page]}
    </div>
  );
}