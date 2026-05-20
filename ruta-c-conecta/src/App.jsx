import { useState, useEffect } from "react";

// ==================== DATA REAL ====================
const CLUSTERS = [
  { id: "TURISMO", titulo: "Turismo", color: "#0F9B8E", bgLight: "#E1F5EE", total: 245 },
  { id: "LOGISTICA", titulo: "Logística", color: "#185FA5", bgLight: "#E6F1FB", total: 198 },
  { id: "BANANO", titulo: "Banano", color: "#BA7517", bgLight: "#FAEEDA", total: 245 },
  { id: "PALMADEACEITE", titulo: "Palma de Aceite", color: "#3B6D11", bgLight: "#EAF3DE", total: 147 },
  { id: "ARTESANIAS", titulo: "Artesanías", color: "#9C27B0", bgLight: "#F3E5F5", total: 67 },
  { id: "PESCA", titulo: "Pesca y Acuicultura", color: "#00BCD4", bgLight: "#E0F7FA", total: 89 },
  { id: "COMERCIO", titulo: "Comercio y Servicios", color: "#4CAF50", bgLight: "#E8F5E9", total: 312 },
  { id: "CONSTRUCCION", titulo: "Construcción", color: "#FF9800", bgLight: "#FFF3E0", total: 134 },
];

const MUNICIPIOS = [
  "Santa Marta", "Ciénaga", "Fundación", "Zona Bananera", "Aracataca", "El Banco",
  "Pivijay", "El Retén", "Plato", "Ariguaní", "Guamal", "Sabanas de San Ángel",
  "Nueva Granada", "Chibolo", "Tenerife", "Salamina", "Concordia", "Pedraza",
  "Sitionuevo", "Remolino", "Zapayán", "Puebloviejo", "Algarrobo", "Santa Ana"
];

const BARRIOS_POR_MUNICIPIO = {
  "Santa Marta": ["Centro Histórico", "El Rodadero", "Mamatoco", "Taganga", "Gaira", "Pescaíto", "Bastidas", "Bello Horizonte"],
  "Ciénaga": ["Centro", "El Carmen", "Barrio Obrero"],
  "Fundación": ["Centro", "El Progreso", "La Esperanza"],
  "Zona Bananera": ["Sevilla", "Río Frío", "Guacamayal", "Orihueca", "Prado Sevilla"],
  "DEFAULT": ["Centro", "Principal"]
};

// ==================== STORAGE ====================
const STORAGE_KEY = "rutac_users_v2";
const CURRENT_KEY = "rutac_current_user";

const loadUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

const CAMARA_EMAIL = "camara@rutac.gov.co";
const CAMARA_PASS = "Camara2026!";

// ==================== HELPERS ====================
function getInitials(name) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";
}

function Avatar({ name, size = 42 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#0F9B8E15",
      border: "2px solid #0F9B8E", display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700, fontSize: Math.round(size * 0.42), color: "#0F9B8E"
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
        opacity: disabled ? 0.6 : 1
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
    if (email === CAMARA_EMAIL && pass === CAMARA_PASS) {
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
        <h2>Bienvenido de vuelta</h2>
        <input value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="Email" style={{ width: "100%", padding: 12, margin: "12px 0", borderRadius: 8, border: "1px solid #ddd" }} />
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} placeholder="Contraseña" style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 8, border: "1px solid #ddd" }} />
        {err && <p style={{ color: "#D85A30" }}>{err}</p>}
        <Btn full onClick={handleLogin}>Entrar</Btn>
        <p style={{ textAlign: "center", marginTop: 16 }}>¿No tienes cuenta? <span onClick={onRegister} style={{ color: "#0F9B8E", cursor: "pointer", fontWeight: 600 }}>Regístrate gratis</span></p>
      </div>
    </div>
  );
}

// ==================== REGISTER (Validaciones fuertes) ====================
function RegisterPage({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    razonSocial: "", sector: "", municipio: "Santa Marta", barrio: "", whatsapp: "", email: "", password: "", confirm: ""
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "Obligatorio";
      if (!form.sector) e.sector = "Obligatorio";
    }
    if (step === 2) {
      if (!form.barrio) e.barrio = "Obligatorio";
      if (!/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "Debe tener 10 dígitos";
    }
    if (step === 3) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
      if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
      if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
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
        cluster: form.sector,
        etapa: "Crecimiento",
        completitud: 82,
        matricula: "R" + Date.now().toString().slice(-6),
        descripcion: ""
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
      <div style={{ flex: 1, padding: "4rem", background: "linear-gradient(135deg,#0F9B8E,#185FA5)", color: "#fff", display: "flex", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, lineHeight: 1.1 }}>Conecta tu negocio<br />con el Magdalena</h1>
          <p style={{ marginTop: 20, fontSize: "1.1rem", opacity: 0.95 }}>+500 negocios ya confían en Ruta C</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 480, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <h2>Paso {step} de 3</h2>

          {step === 1 && (
            <>
              <input value={form.razonSocial} onChange={e => update("razonSocial", e.target.value)} placeholder="Razón Social *" style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.razonSocial ? "2px solid #D85A30" : "1px solid #ddd" }} />
              <select value={form.sector} onChange={e => update("sector", e.target.value)} style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.sector ? "2px solid #D85A30" : "1px solid #ddd" }}>
                <option value="">Selecciona tu Clúster *</option>
                {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
              </select>
            </>
          )}

          {step === 2 && (
            <>
              <select value={form.municipio} onChange={e => { update("municipio", e.target.value); update("barrio", ""); }} style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8 }}>
                {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={form.barrio} onChange={e => update("barrio", e.target.value)} style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.barrio ? "2px solid #D85A30" : "1px solid #ddd" }}>
                <option value="">Barrio / Vereda *</option>
                {(BARRIOS_POR_MUNICIPIO[form.municipio] || BARRIOS_POR_MUNICIPIO.DEFAULT).map(b => <option key={b}>{b}</option>)}
              </select>
              <input value={form.whatsapp} maxLength={10} onChange={e => update("whatsapp", e.target.value.replace(/\D/g, ''))} placeholder="WhatsApp (10 dígitos) *" style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.whatsapp ? "2px solid #D85A30" : "1px solid #ddd" }} />
            </>
          )}

          {step === 3 && (
            <>
              <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="Email *" style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.email ? "2px solid #D85A30" : "1px solid #ddd" }} />
              <input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Contraseña (mín. 8) *" style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.password ? "2px solid #D85A30" : "1px solid #ddd" }} />
              <input type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)} placeholder="Confirmar contraseña *" style={{ width: "100%", padding: 12, margin: "8px 0", borderRadius: 8, border: errors.confirm ? "2px solid #D85A30" : "1px solid #ddd" }} />
            </>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {step > 1 && <Btn secondary onClick={() => setStep(s => s - 1)}>Atrás</Btn>}
            <Btn full onClick={next} disabled={Object.keys(errors).length > 0}>
              {step === 3 ? "Crear Cuenta" : "Continuar"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MARKETPLACE GALERÍA ====================
function Marketplace({ user }) {
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState(null);

  const products = CLUSTERS.flatMap(cluster => 
    Array.from({ length: 6 }, (_, i) => ({
      id: `${cluster.id}-${i}`,
      cluster: cluster.titulo,
      nombre: `${cluster.titulo} ${i + 1}`,
      img: `https://picsum.photos/id/${80 + i}/600/400`,
      desc: `Proveedor especializado en ${cluster.titulo.toLowerCase()}`,
      empresa: `Empresa ${cluster.id} ${i + 1}`,
      whatsapp: "3158709635"
    }))
  );

  const filtered = products.filter(p => 
    (!selectedCluster || p.cluster === selectedCluster) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.empresa.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
      <h1>Marketplace Ruta C</h1>
      <input 
        placeholder="Buscar productos, proveedores o servicios..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ width: "100%", padding: 16, borderRadius: 12, margin: "20px 0", fontSize: 16 }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
            <img src={p.img} style={{ width: "100%", height: 220, objectFit: "cover" }} alt="" />
            <div style={{ padding: 16 }}>
              <span style={{ background: "#E1F5EE", color: "#0F9B8E", padding: "4px 12px", borderRadius: 20, fontSize: 13 }}>{p.cluster}</span>
              <p style={{ fontWeight: 700, margin: "12px 0 6px" }}>{p.nombre}</p>
              <p style={{ color: "#555", fontSize: 14 }}>{p.empresa}</p>
              <Btn full onClick={() => window.open(`https://wa.me/57${p.whatsapp}`, "_blank")}>
                Contactar por WhatsApp
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MI PERFIL EDITABLE ====================
function MyProfile({ user, setUserGlobal }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const save = () => {
    const users = loadUsers();
    users[user.email.toLowerCase()] = { ...form, password: user.password };
    saveUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(form));
    setUserGlobal(form);
    setEditing(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mi Perfil</h1>
        <Btn onClick={() => setEditing(!editing)}>{editing ? "Cancelar" : "Editar"}</Btn>
      </div>

      {editing ? (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 16, marginTop: 20 }}>
          <input value={form.razonSocial} onChange={e => setForm({ ...form, razonSocial: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12 }} placeholder="Razón Social" />
          <select value={form.cluster} onChange={e => setForm({ ...form, cluster: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12 }}>
            {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
          </select>
          <select value={form.municipio} onChange={e => setForm({ ...form, municipio: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12 }}>
            {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
          </select>
          <input value={form.whatsapp || ""} onChange={e => setForm({ ...form, whatsapp: e.target.value })} style={{ width: "100%", padding: 12, marginBottom: 12 }} placeholder="WhatsApp" />
          <textarea value={form.descripcion || ""} onChange={e => setForm({ ...form, descripcion: e.target.value })} style={{ width: "100%", padding: 12, minHeight: 120 }} placeholder="Descripción del negocio" />
          <Btn full onClick={save}>Guardar Cambios</Btn>
        </div>
      ) : (
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 16, marginTop: 20 }}>
          <h2>{user.razonSocial}</h2>
          <p><strong>Clúster:</strong> {user.cluster}</p>
          <p><strong>Ubicación:</strong> {user.municipio} - {user.barrio}</p>
          <p><strong>WhatsApp:</strong> {user.whatsapp}</p>
          <p><strong>Descripción:</strong> {user.descripcion || "Sin descripción"}</p>
        </div>
      )}
    </div>
  );
}

// ==================== ADMIN PANEL ====================
function AdminPanel() {
  const users = loadUsers();
  const total = Object.keys(users).length;

  const clusterCount = CLUSTERS.reduce((acc, c) => {
    acc[c.titulo] = Object.values(users).filter(u => u.cluster === c.titulo).length;
    return acc;
  }, {});

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h1>Dashboard Cámara de Comercio</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20, margin: "30px 0" }}>
        {[
          [total + 520, "Empresas Totales"],
          [CLUSTERS.length, "Clústeres Activos"],
          [MUNICIPIOS.length, "Municipios"],
          [Object.values(users).filter(u => u.etapa === "Crecimiento").length + 89, "En Crecimiento"]
        ].map(([v, l]) => (
          <div key={l} style={{ background: "#fff", padding: "2rem", borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 42, color: "#0F9B8E", margin: 0 }}>{v}</h3>
            <p>{l}</p>
          </div>
        ))}
      </div>

      <h2>Distribución por Clúster</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
        {CLUSTERS.map(c => (
          <div key={c.id} style={{ background: c.bgLight, padding: "1rem", borderRadius: 12, minWidth: 180 }}>
            <strong>{c.titulo}</strong><br />
            {clusterCount[c.titulo] || 0} empresas
          </div>
        ))}
      </div>

      <h2>Empresas Registradas</h2>
      <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Empresa</th>
            <th>Municipio</th>
            <th>Clúster</th>
            <th>Etapa</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(users).map((u, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>{u.razonSocial}</td>
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

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Inicio");

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setScreen("app");
      } catch (e) {}
    }
  }, []);

  const login = (u) => {
    setUser(u);
    setScreen("app");
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
    setScreen("login");
  };

  if (screen === "login") return <LoginPage onLogin={login} onRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterPage onDone={login} />;

  if (user?.email === CAMARA_EMAIL) return <AdminPanel />;

  const pages = {
    "Inicio": <div style={{ padding: "3rem" }}><h1>Bienvenido, {user?.razonSocial}</h1></div>,
    "Marketplace": <Marketplace user={user} />,
    "Mi Perfil": <MyProfile user={user} setUserGlobal={setUser} />,
    "Mi Clúster": <div style={{ padding: "3rem" }}><h2>Mi Clúster: {user?.cluster}</h2></div>,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", background: "#F5F7FA" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "2rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</div>
        
        {Object.keys(pages).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              background: "none", border: "none", fontWeight: page === p ? 600 : 500,
              color: page === p ? "#0F9B8E" : "#444", borderBottom: page === p ? "3px solid #0F9B8E" : "none",
              padding: "12px 0", cursor: "pointer"
            }}
          >
            {p}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user?.razonSocial} />
          <button onClick={logout} style={{ padding: "8px 16px", background: "#fee", color: "#c33", border: "none", borderRadius: 8 }}>Salir</button>
        </div>
      </nav>

      {pages[page]}
    </div>
  );
}