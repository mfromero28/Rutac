import { useState, useEffect } from "react";

// ==================== DATOS REALES MAGDALENA ====================
const MUNICIPIOS_BARRIOS = {
  "Santa Marta": ["Centro Histórico", "El Rodadero", "Mamatoco", "Taganga", "Gaira", "Pescaíto", "Bastidas", "Las Américas", "Bello Horizonte", "Los Almendros", "Timayui", "San Jorge", "Pozos Colorados", "El Parque", "Villa del Mar"],
  "Ciénaga": ["Centro", "El Carmen", "Barrio Obrero", "Villa Estadio", "El Paraíso", "Pescadores", "La Ye"],
  "Fundación": ["Centro", "El Progreso", "La Esperanza", "Barrio Nuevo", "La Granja", "El Bosque"],
  "Zona Bananera": ["Sevilla", "Río Frío", "Guacamayal", "Orihueca", "Prado Sevilla", "Riofrío", "Tucurinca", "Varela", "Santa Rosalía", "Palomar"],
  "Aracataca": ["Centro", "El Recreo", "Barrio Nuevo", "La Esperanza", "Las Flores"],
  "El Banco": ["Centro", "Barrio Arriba", "Barrio Abajo", "El Carmen", "Las Flores", "Villa Nueva"],
  "Pivijay": ["Centro", "Barrio Nuevo", "La Esperanza", "El Progreso"],
  "El Retén": ["Centro", "Barrio Nuevo", "La Unión"],
  "Plato": ["Centro", "La Playita", "Barrio Nuevo", "El Paraíso", "Villa del Río"],
  "Ariguaní (El Difícil)": ["El Difícil", "Centro", "Barrio Nuevo", "La Esperanza"],
  "Guamal": ["Centro", "Barrio Nuevo", "Las Flores"],
  "Sabanas de San Ángel": ["San Ángel", "Centro", "Barrio Nuevo"],
  "Nueva Granada": ["Centro", "Barrio Nuevo", "El Progreso"],
  "Chibolo": ["Centro", "Barrio Nuevo", "Las Flores"],
  "Tenerife": ["Centro", "Barrio Nuevo", "La Esperanza"],
  "Salamina": ["Centro", "Barrio Nuevo"],
  "Concordia": ["Centro", "Barrio Nuevo"],
  "Pedraza": ["Centro", "Barrio Nuevo"],
  "Sitionuevo": ["Centro", "Barrio Nuevo", "La Barra"],
  "Remolino": ["Centro", "Barrio Nuevo"],
  "Zapayán": ["Punta de Piedras", "Centro", "Barrio Nuevo"],
  "Puebloviejo": ["Centro", "La Barra", "Isla del Rosario"],
  "Algarrobo": ["Centro", "Barrio Nuevo"],
  "Santa Ana": ["Centro", "Barrio Nuevo", "El Paraíso"],
  "San Zenón": ["Centro", "Barrio Nuevo"],
};

const MUNICIPIOS = Object.keys(MUNICIPIOS_BARRIOS);

const CLUSTERS = [
  { id: "TURISMO", titulo: "Turismo", color: "#0F9B8E", bgLight: "#E1F5EE", total: 245 },
  { id: "LOGISTICA", titulo: "Logística", color: "#185FA5", bgLight: "#E6F1FB", total: 198 },
  { id: "BANANO", titulo: "Banano", color: "#BA7517", bgLight: "#FAEEDA", total: 245 },
  { id: "PALMA", titulo: "Palma de Aceite", color: "#3B6D11", bgLight: "#EAF3DE", total: 147 },
  { id: "ARTESANIAS", titulo: "Artesanías", color: "#9C27B0", bgLight: "#F3E5F5", total: 67 },
  { id: "PESCA", titulo: "Pesca y Acuicultura", color: "#00BCD4", bgLight: "#E0F7FA", total: 89 },
  { id: "COMERCIO", titulo: "Comercio y Servicios", color: "#4CAF50", bgLight: "#E8F5E9", total: 312 },
  { id: "CONSTRUCCION", titulo: "Construcción", color: "#FF9800", bgLight: "#FFF3E0", total: 134 },
];

const ETAPAS = ["Ideación", "Inicio", "Crecimiento", "Consolidación", "Madurez", "Expansión"];
const TIEMPOS = ["Menos de 1 año", "1 a 3 años", "3 a 5 años", "5 a 10 años", "Más de 10 años"];

// ==================== STORAGE ====================
const STORAGE_KEY = "rutac_users_v3";
const CURRENT_KEY = "rutac_current_user_v3";

const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const saveUsers = (u) => localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
const loadCurrent = () => {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)); } catch { return null; }
};
const saveCurrent = (u) => localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
const clearCurrent = () => localStorage.removeItem(CURRENT_KEY);

const ADMIN_EMAIL = "camara@rutac.gov.co";
const ADMIN_PASS = "Camara2026!";

// ==================== HELPERS ====================
function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";
}

function clusterColor(clusterTitulo) {
  return CLUSTERS.find(c => c.titulo === clusterTitulo)?.color || "#0F9B8E";
}

// ==================== ESTILOS BASE ====================
const base = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  input: {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #D8DDE5", fontSize: 15, outline: "none",
    background: "#fff", boxSizing: "border-box", color: "#1A1A2E"
  },
  inputError: {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #D85A30", fontSize: 15, outline: "none",
    background: "#FFF5F2", boxSizing: "border-box", color: "#1A1A2E"
  },
  label: { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 4, display: "block" },
  error: { color: "#D85A30", fontSize: 12, marginTop: 3 },
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "1.5rem" },
};

// ==================== COMPONENTES ====================
function Avatar({ name, size = 40, color }) {
  const bg = color || clusterColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg + "18", border: `2px solid ${bg}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: Math.round(size * 0.38), color: bg,
      flexShrink: 0, letterSpacing: 0.5
    }}>
      {getInitials(name)}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", full = false, disabled = false, small = false }) {
  const styles = {
    primary: { background: "#0F9B8E", color: "#fff", border: "none" },
    secondary: { background: "#fff", color: "#0F9B8E", border: "1.5px solid #0F9B8E" },
    ghost: { background: "transparent", color: "#555", border: "1.5px solid #D8DDE5" },
    danger: { background: "#FFF0EE", color: "#D85A30", border: "1.5px solid #FFCDC4" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: small ? "7px 16px" : "11px 24px",
      borderRadius: 10, fontWeight: 600, fontSize: small ? 13 : 15,
      width: full ? "100%" : "auto", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif",
      transition: "opacity .15s", whiteSpace: "nowrap"
    }}>
      {children}
    </button>
  );
}

function Badge({ children, color = "#0F9B8E" }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}40`,
      borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600
    }}>
      {children}
    </span>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={base.label}>{label}</label>}
      {children}
      {error && <p style={base.error}>{error}</p>}
    </div>
  );
}

// ==================== LOGIN ====================
function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (!email || !pass) { setErr("Completa todos los campos"); return; }
    if (email.toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const admin = { email: ADMIN_EMAIL, role: "admin", razonSocial: "Cámara de Comercio de Santa Marta" };
      saveCurrent(admin); onLogin(admin); return;
    }
    const users = loadUsers();
    const user = users[email.toLowerCase().trim()];
    if (user && user.password === pass) {
      saveCurrent(user); onLogin(user);
    } else {
      setErr("Correo o contraseña incorrectos");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: base.fontFamily }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "2.5rem", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20 }}>C</div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>Bienvenido de vuelta</h2>
        <p style={{ color: "#666", marginBottom: 22, fontSize: 14 }}>Ingresa a tu cuenta de emprendedor</p>
        <Field label="Correo electrónico">
          <input value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
            placeholder="tu@correo.com" style={base.input} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        <Field label="Contraseña">
          <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }}
            placeholder="••••••••" style={base.input} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        {err && <p style={{ ...base.error, marginBottom: 10 }}>{err}</p>}
        <Btn full onClick={handleLogin}>Entrar</Btn>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#555" }}>
          ¿Aún no tienes cuenta?{" "}
          <span onClick={onRegister} style={{ color: "#0F9B8E", cursor: "pointer", fontWeight: 600 }}>Regístrate gratis</span>
        </p>
      </div>
    </div>
  );
}

// ==================== REGISTRO 4 PASOS ====================
function RegisterPage({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    razonSocial: "", registradoCamara: "", sector: "", tiempoOperando: "", descripcion: "",
    municipio: "Santa Marta", barrio: "", whatsapp: "", email: "", password: "", confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "El nombre del negocio es obligatorio";
      if (!form.registradoCamara) e.registradoCamara = "Selecciona una opción";
      if (!form.sector) e.sector = "Selecciona un sector";
      if (!form.tiempoOperando) e.tiempoOperando = "Selecciona un rango";
    }
    if (step === 2) {
      if (!form.barrio) e.barrio = "Selecciona un barrio o vereda";
      if (!/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "Debe tener exactamente 10 dígitos";
    }
    if (step === 3) {
      // review step — just check terms
    }
    if (step === 4) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Ingresa un email válido";
      if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
      if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 4) {
      const users = loadUsers();
      if (users[form.email.toLowerCase().trim()]) {
        setErrors({ email: "Ya existe una cuenta con este correo" });
        return;
      }
      const newUser = {
        ...form,
        email: form.email.toLowerCase().trim(),
        id: Date.now().toString(),
        role: "user",
        cluster: form.sector,
        etapa: "Inicio",
        completitud: 70,
        matricula: "R" + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString(),
      };
      delete newUser.confirm;
      users[newUser.email] = newUser;
      saveUsers(users);
      saveCurrent(newUser);
      onDone(newUser);
    } else {
      setStep(s => s + 1);
    }
  };

  const STEP_TITLES = ["Tu negocio", "¿Dónde te encontramos?", "Revisa antes de enviar", "Crea tu acceso"];

  const leftContent = [
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Únete a la red que está transformando la economía local. Posiciona tu negocio, gestiona pedidos y conecta con la comunidad samaria." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Únete a la red que está transformando la economía local." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Verifica que todo esté correcto antes de continuar." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Crea tu acceso seguro para gestionar tu negocio." },
  ];

  const left = leftContent[step - 1];
  const progressPct = (step / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", fontFamily: base.fontFamily }}>
      {/* Left panel */}
      <div style={{ flex: "0 0 45%", background: "#F0F6FF", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3rem 3.5rem", position: "relative", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#888", cursor: "pointer" }}>Iniciar sesión</span>
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", border: "1px solid #B2DFD3", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F9B8E" }}>{left.tag}</span>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.15, color: "#1A1A2E", margin: "0 0 16px" }}>
            {left.headline.replace("100% gratis", "")}
            <span style={{ color: "#0F9B8E" }}>100% gratis</span>
          </h1>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{left.sub}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 20, padding: "7px 16px" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
            </div>
            <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>+500 negocios ya confían en Ruta C</span>
          </div>

          {/* Image placeholder */}
          <div style={{ marginTop: 32, borderRadius: 16, overflow: "hidden", position: "relative", background: "#1A1A2E" }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=350&fit=crop" alt="" style={{ width: "100%", height: 220, objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 1.2rem", background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "#0F9B8E", padding: "2px 10px", borderRadius: 20 }}>HECHO PARA EMPRENDEDORES</span>
              </div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>Tu negocio, en el mapa de Santa Marta</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0 }}>La Cámara de Comercio te conecta con clientes, aliados y proveedores cerca de ti.</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ height: 4, background: "#E0E0E0", borderRadius: 4, marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "#0F9B8E", borderRadius: 4, transition: "width .3s" }} />
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Paso {step} de 4</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
          <p style={{ color: "#0F9B8E", fontWeight: 600, fontSize: 13, margin: "0 0 6px" }}>PASO {step} DE 4</p>
          <h2 style={{ margin: "0 0 24px", fontSize: 24 }}>{STEP_TITLES[step - 1]}</h2>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Field label="Nombre del negocio *" error={errors.razonSocial}>
                <input value={form.razonSocial} onChange={e => update("razonSocial", e.target.value)}
                  placeholder="Empanadas Doña Marleny"
                  style={errors.razonSocial ? base.inputError : base.input} />
                <span style={{ fontSize: 12, color: "#888" }}>Como te conocen los clientes</span>
              </Field>

              <Field label="¿Estás registrado en la Cámara de Comercio? *" error={errors.registradoCamara}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { val: "si", title: "Sí, ya estoy registrado", sub: "Tengo NIT y registro mercantil vigente." },
                    { val: "no", title: "No, todavía no", sub: "Soy un negocio informal o estoy empezando." }
                  ].map(opt => (
                    <div key={opt.val} onClick={() => update("registradoCamara", opt.val)} style={{
                      padding: "14px", borderRadius: 10, cursor: "pointer",
                      border: form.registradoCamara === opt.val ? "2px solid #0F9B8E" : "1.5px solid #D8DDE5",
                      background: form.registradoCamara === opt.val ? "#E1F5EE" : "#fff"
                    }}>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>{opt.title}</p>
                      <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{opt.sub}</p>
                    </div>
                  ))}
                </div>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Sector *" error={errors.sector}>
                  <select value={form.sector} onChange={e => update("sector", e.target.value)}
                    style={errors.sector ? base.inputError : base.input}>
                    <option value="">Selecciona un sector</option>
                    {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                  </select>
                </Field>
                <Field label="¿Hace cuánto tiempo operas? *" error={errors.tiempoOperando}>
                  <select value={form.tiempoOperando} onChange={e => update("tiempoOperando", e.target.value)}
                    style={errors.tiempoOperando ? base.inputError : base.input}>
                    <option value="">Selecciona un rango</option>
                    {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Cuéntanos qué haces *">
                <textarea value={form.descripcion} onChange={e => update("descripcion", e.target.value)}
                  placeholder="Vendo empanadas frente al edificio Bavaria, abro de 7 am a 3 pm. Hago de pollo, carne y queso."
                  maxLength={280}
                  style={{ ...base.input, minHeight: 100, resize: "vertical" }} />
                <span style={{ fontSize: 12, color: "#888" }}>{form.descripcion.length}/280</span>
              </Field>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Esto nos ayuda a conectarte con clientes y aliados cerca de ti.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Municipio *">
                  <select value={form.municipio} onChange={e => { update("municipio", e.target.value); update("barrio", ""); }}
                    style={base.input}>
                    {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span style={{ fontSize: 12, color: "#888" }}>Magdalena</span>
                </Field>
                <Field label="Barrio o vereda *" error={errors.barrio}>
                  <select value={form.barrio} onChange={e => update("barrio", e.target.value)}
                    style={errors.barrio ? base.inputError : base.input}>
                    <option value="">Selecciona</option>
                    {(MUNICIPIOS_BARRIOS[form.municipio] || []).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <span style={{ fontSize: 12, color: "#888" }}>Donde está tu negocio</span>
                </Field>
              </div>

              <Field label="WhatsApp *" error={errors.whatsapp}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ background: "#F5F5F5", border: "1.5px solid #D8DDE5", borderRadius: 8, padding: "11px 14px", fontWeight: 600, fontSize: 15, color: "#333", whiteSpace: "nowrap" }}>+57</div>
                  <input value={form.whatsapp} maxLength={10}
                    onChange={e => update("whatsapp", e.target.value.replace(/\D/g, ""))}
                    placeholder="3158709635"
                    style={{ ...base.input, ...(errors.whatsapp ? { borderColor: "#D85A30", background: "#FFF5F2" } : {}) }} />
                </div>
                <span style={{ fontSize: 12, color: "#888" }}>Te escribiremos por aquí</span>
              </Field>

              <Field label="Email">
                <input value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="mafalvarado28@gmail.com" style={base.input} />
                <span style={{ fontSize: 12, color: "#888" }}>Opcional. Te enviaremos recursos y novedades.</span>
              </Field>
            </>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Verifica que todo esté correcto. Puedes editar cualquier sección.</p>
              <ReviewSection title="Tu negocio" onEdit={() => setStep(1)} rows={[
                ["NOMBRE DEL NEGOCIO", form.razonSocial],
                ["¿ESTÁS REGISTRADO EN LA CÁMARA DE COMERCIO?", form.registradoCamara === "si" ? "Sí, ya estoy registrado" : "No, todavía no"],
                ["SECTOR", form.sector],
                ["¿HACE CUÁNTO TIEMPO OPERAS?", form.tiempoOperando],
                ["CUÉNTANOS QUÉ HACES", form.descripcion],
              ]} />
              <ReviewSection title="¿Dónde te encontramos?" onEdit={() => setStep(2)} rows={[
                ["MUNICIPIO", form.municipio],
                ["BARRIO O VEREDA", form.barrio],
                ["WHATSAPP", form.whatsapp ? `+57 ${form.whatsapp}` : "—"],
                ["EMAIL", form.email || "—"],
              ]} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "14px 16px", marginTop: 12 }}>
                <input type="checkbox" id="terms" defaultChecked style={{ marginTop: 3 }} />
                <label htmlFor="terms" style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                  Acepto los <span style={{ color: "#0F9B8E", fontWeight: 600 }}>términos y políticas de privacidad</span> de la Cámara de Comercio de Santa Marta.
                </label>
              </div>
            </>
          )}

          {/* STEP 4: Account */}
          {step === 4 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Crea tu contraseña para acceder a tu cuenta.</p>
              <Field label="Correo electrónico *" error={errors.email}>
                <input value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="tu@correo.com"
                  style={errors.email ? base.inputError : base.input} />
              </Field>
              <Field label="Contraseña (mín. 8 caracteres) *" error={errors.password}>
                <input type="password" value={form.password} onChange={e => update("password", e.target.value)}
                  placeholder="••••••••"
                  style={errors.password ? base.inputError : base.input} />
              </Field>
              <Field label="Confirmar contraseña *" error={errors.confirm}>
                <input type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)}
                  placeholder="••••••••"
                  style={errors.confirm ? base.inputError : base.input} />
              </Field>
            </>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {step > 1 && <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>← Atrás</Btn>}
            <Btn full onClick={next}>
              {step === 4 ? "Crear mi perfil" : "Continuar →"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, rows }) {
  return (
    <div style={{ border: "1.5px solid #E8E8E8", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
        <button onClick={onEdit} style={{ background: "none", border: "none", color: "#0F9B8E", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          ✎ Editar
        </button>
      </div>
      {rows.map(([k, v]) => v && (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid #F0F0F0" }}>
          <span style={{ fontSize: 12, color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", textAlign: "right", maxWidth: "55%" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ==================== NAVBAR ====================
function Navbar({ user, page, setPage, onLogout }) {
  const navItems = user?.role === "admin"
    ? ["Dashboard", "Empresas", "Clusters", "Reportes"]
    : ["Inicio", "Recomendaciones", "Mi clúster", "Conexiones", "Mi negocio"];

  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #EAEAEA",
      padding: "0 2rem", display: "flex", alignItems: "center", gap: "1.5rem",
      position: "sticky", top: 0, zIndex: 100, height: 58
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 7C3 3 6 1 9 1C12 1 15 3 17 7C15 11 12 13 9 13C6 13 3 11 1 7Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <circle cx="9" cy="7" r="2.5" stroke="#fff" strokeWidth="1.5"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span></span>
      </div>

      {navItems.map(p => (
        <button key={p} onClick={() => setPage(p)} style={{
          background: "none", border: "none", fontWeight: page === p ? 600 : 400,
          color: page === p ? "#0F9B8E" : "#555", fontSize: 14,
          borderBottom: page === p ? "2px solid #0F9B8E" : "2px solid transparent",
          padding: "20px 2px", cursor: "pointer", fontFamily: base.fontFamily, whiteSpace: "nowrap"
        }}>{p}</button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: clusterColor(user?.cluster) + "20",
            border: `2px solid ${clusterColor(user?.cluster)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12, color: clusterColor(user?.cluster)
          }}>
            {getInitials(user?.razonSocial)}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>{user?.razonSocial?.split(" ")[0]}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#888", fontSize: 13, fontFamily: base.fontFamily }}>Salir</button>
      </div>
    </nav>
  );
}

// ==================== INICIO ====================
function InicioPage({ user }) {
  const cluster = CLUSTERS.find(c => c.titulo === user.cluster);
  const completitud = user.completitud || 70;

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ background: "linear-gradient(135deg, #0F9B8E, #185FA5)", borderRadius: 18, padding: "2rem 2.5rem", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: "0 0 6px", opacity: 0.85, fontSize: 14 }}>Bienvenido de vuelta</p>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>{user.razonSocial}</h1>
          <div style={{ display: "flex", gap: 10 }}>
            {cluster && <Badge color="#fff">{cluster.titulo}</Badge>}
            <Badge color="#fff">{user.municipio}</Badge>
            <Badge color="#fff">Etapa: {user.etapa}</Badge>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: "3px solid rgba(255,255,255,0.4)" }}>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{completitud}%</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>Perfil</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Vistas al perfil", val: "0", sub: "Esta semana" },
          { label: "Conexiones activas", val: "0", sub: "Empresas conectadas" },
          { label: "Recomendaciones", val: "6", sub: "Actores priorizados" },
          { label: "Completitud del perfil", val: `${completitud}%`, sub: "Mejora tu visibilidad" },
        ].map(k => (
          <div key={k.label} style={{ ...base.card }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</p>
            <h2 style={{ margin: "0 0 2px", fontSize: 30, fontWeight: 800, color: "#0F9B8E" }}>{k.val}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Completitud bar */}
      {completitud < 100 && (
        <div style={{ ...base.card, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Completa tu perfil</h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>Un perfil completo recibe 3x más conexiones</p>
            </div>
            <span style={{ fontWeight: 700, color: "#0F9B8E", fontSize: 18 }}>{completitud}%</span>
          </div>
          <div style={{ height: 8, background: "#F0F0F0", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${completitud}%`, background: "#0F9B8E", borderRadius: 4, transition: "width .5s" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            {["Agrega foto de perfil", "Describe tus productos", "Agrega dirección exacta"].map(t => (
              <span key={t} style={{ background: "#FFF9E6", color: "#BA7517", border: "1px solid #FFE0A0", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Clusters */}
      <div style={{ ...base.card }}>
        <h3 style={{ margin: "0 0 16px" }}>Clústeres activos en el Magdalena</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {CLUSTERS.map(c => (
            <div key={c.id} style={{ background: c.bgLight, borderRadius: 10, padding: "14px", border: user.cluster === c.titulo ? `2px solid ${c.color}` : "2px solid transparent" }}>
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14, color: c.color }}>{c.titulo}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{c.total} empresas</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== RECOMENDACIONES ====================
function RecomendacionesPage({ user }) {
  const actors = [
    { id: 1, initials: "CD", name: "CASTILLO DE HORTA KESSIA ORNELLA", desc: "Comercio al por menor en establecimientos no especializados, con surtido compuesto principalmente por productos diferentes de alimentos (víveres en general), bebidas (alcohólicas y no alcohólicas) y tab", city: "SANTA MARTA", ciiu: "G4719", match: 89, tipo: "Cliente potencial", nueva: true },
    { id: 2, initials: "ZB", name: "ZUÑIGA BELTRAN TOMAS ALFONSO", desc: "Comercio al por menor en establecimientos no especializados, con surtido compuesto principalmente por productos diferentes de alimentos (víveres en general), bebidas (alcohólicas y no alcohólicas) y tab", city: "SANTA MARTA", ciiu: "G4719", match: 85, tipo: "Cliente potencial", nueva: false },
    { id: 3, initials: "DD", name: "DIANA DEL CARMEN RUDAS URIELES", desc: "Comercio al por menor de productos agrícolas para el consumo en establecimientos especializados (CIIU G4721) · SANTA MARTA.", city: "SANTA MARTA", ciiu: "G4721", match: 82, tipo: "Aliado", nueva: false },
    { id: 4, initials: "LY", name: "LORENA YOLIMA AVENDAÑO MIRANDA", desc: "Comercio al por menor de productos agrícolas para el consumo en establecimientos especializados (CIIU G4721) · SANTA MARTA.", city: "SANTA MARTA", ciiu: "G4721", match: 79, tipo: "Aliado", nueva: false },
    { id: 5, initials: "AB", name: "AVENDAÑO BELLO EDWIN ANDRES", desc: "Comercio al por menor de carnes (incluye aves de corral), productos cárnicos, pescados y productos de mar, en establecimientos especializados (CIIU G4723) · SANTA MARTA", city: "SANTA MARTA", ciiu: "G4723", match: 76, tipo: "Proveedor", nueva: false },
    { id: 6, initials: "PT", name: "PEREZ TORRES JULIA HORTENCIA", desc: "Comercio al por menor de carnes (incluye aves de corral), productos cárnicos, pescados y productos de mar, en establecimientos especializados (CIIU G4723) · SANTA MARTA", city: "SANTA MARTA", ciiu: "G4723", match: 71, tipo: "Referente", nueva: false },
  ];

  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("Todas");
  const tabs = ["Todas", "Proveedor", "Aliado", "Cliente", "Referente"];
  const tipoColor = { "Cliente potencial": "#185FA5", "Aliado": "#0F9B8E", "Proveedor": "#BA7517", "Referente": "#9C27B0" };

  const filtered = tab === "Todas" ? actors : actors.filter(a => a.tipo.includes(tab));

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 6px", fontSize: 26 }}>Recomendaciones</h1>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{actors.length} actores priorizados para {user.razonSocial} · actualizado hace 3 horas</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small>Filtros</Btn>
          <Btn variant="ghost" small>Ordenar: score</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "2px solid #EAEAEA" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", padding: "10px 16px",
            fontWeight: tab === t ? 600 : 400, color: tab === t ? "#0F9B8E" : "#666",
            borderBottom: tab === t ? "2px solid #0F9B8E" : "2px solid transparent",
            cursor: "pointer", fontSize: 14, fontFamily: base.fontFamily,
            marginBottom: -2
          }}>{t} {t === "Todas" ? actors.length : actors.filter(a => a.tipo.includes(t)).length}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAEAEA", overflow: "hidden" }}>
        <div style={{ padding: "10px 20px", background: "#F8F9FA", fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 0.5, textTransform: "uppercase" }}>ACTOR</div>
        {filtered.map((a, i) => (
          <div key={a.id} onClick={() => setSelected(a)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
            borderTop: "1px solid #F0F0F0", cursor: "pointer",
            background: selected?.id === a.id ? "#F0FBF9" : "transparent",
            transition: "background .15s"
          }}>
            <Avatar name={a.initials} size={38} color={tipoColor[a.tipo]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{a.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</p>
            </div>
            <Badge color={tipoColor[a.tipo]}>{a.tipo}</Badge>
          </div>
        ))}
        <div style={{ padding: "12px", textAlign: "center", fontSize: 13, color: "#888", borderTop: "1px solid #F0F0F0" }}>
          Mostrando {filtered.length} de {actors.length}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 200 }}>
          <div style={{ background: "#fff", width: 420, height: "100%", overflowY: "auto", padding: "1.5rem", position: "relative" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <Avatar name={selected.initials} size={48} color={tipoColor[selected.tipo]} />
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{selected.name}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{selected.desc.slice(0, 80)}...</p>
                <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                  {selected.nueva && <Badge color="#BA7517">Nueva</Badge>}
                </div>
              </div>
            </div>

            <div style={{ background: "#F8F9FA", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 600 }}>MATCH</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#1A1A2E" }}>{selected.match}%</span>
                <Badge color={tipoColor[selected.tipo]}>{selected.tipo}</Badge>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>¿Por qué a ti?</p>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                Las empresas del sector {selected.ciiu} suelen complementar con negocios del sector de {user.cluster?.toLowerCase()}. Ambas en {selected.city}.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>DATOS QUE SUSTENTAN LA RECOMENDACIÓN</p>
              {[
                ["Sector compatible", `CIIU ${selected.ciiu} - compatible con ${user.cluster}`],
                ["Ubicación", `Ambas en ${selected.city}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F0F0" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, maxWidth: "55%", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#888", textTransform: "uppercase" }}>CÓMO CONTACTAR</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F9B8E" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.67 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span style={{ fontSize: 14 }}>WhatsApp +57 —</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" small onClick={() => setSelected(null)}>Descartar</Btn>
              <Btn variant="secondary" small>Guardar</Btn>
              <Btn small onClick={() => setSelected(null)}>Aceptar conexión</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== MI CLÚSTER ====================
function MiClusterPage({ user }) {
  const cluster = CLUSTERS.find(c => c.titulo === user.cluster) || CLUSTERS[0];
  const members = [
    { initials: "CR", name: "Hotel Brisas Marinas", sub: `${cluster.titulo} · El Rodadero`, match: 92, status: "TU", connected: false },
    { initials: "HC", name: "Hotel Casa Bambú", sub: `${cluster.titulo} · El Rodadero`, match: 88, status: "CONECTADO", connected: true },
    { initials: "MA", name: user.razonSocial || "Mar Azul Boutique", sub: `${cluster.titulo} · El Rodadero`, match: 84, status: "CONECTADO", connected: true },
    { initials: "SN", name: "Hostal Sierra Nevada", sub: `${cluster.titulo} · Bavaria`, match: 81, status: "CONECTADO", connected: true },
    { initials: "PE", name: "Posada El Faro", sub: `${cluster.titulo} · Taganga`, match: 76, status: "SIN CONECTAR", connected: false },
    { initials: "CV", name: "Casa Verde del Caribe", sub: `${cluster.titulo} · El Rodadero`, match: 75, status: "SIN CONECTAR", connected: false },
    { initials: "PG", name: "La Posada de Gaira", sub: `${cluster.titulo} · Gaira`, match: 71, status: "SIN CONECTAR", connected: false },
    { initials: "AL", name: "Hotel Aluna Beach", sub: `${cluster.titulo} · El Rodadero`, match: 68, status: "SIN CONECTAR", connected: false },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem 2rem", marginBottom: 20, border: "1px solid #EAEAEA" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>TU CLÚSTER</p>
        <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 800 }}>{cluster.titulo} en {user.municipio || "Santa Marta"}</h1>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666" }}>Etapa: {user.etapa}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[["MIEMBROS DEL CLÚSTER", members.length], ["CONEXIONES ACTIVAS", "3 conexiones"], ["TU CENTRALIDAD", "92%"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: cluster.bgLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cluster.color} strokeWidth="2"><circle cx="9" cy="9" r="6"/><path d="M15 15l6 6"/></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{k}</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1rem 1.5rem", marginBottom: 20, border: "1px solid #EAEAEA" }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Características compartidas</p>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px" }}>Lo que tu clúster tiene en común y define el matching.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Negocio formal", "3-10 años operando", "Sector " + cluster.titulo, "Santa Marta", "Programa Ruta C"].map(t => (
            <span key={t} style={{ background: cluster.bgLight, color: cluster.color, border: `1px solid ${cluster.color}30`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Members grid */}
      <h2 style={{ fontSize: 18, marginBottom: 6 }}>Miembros del clúster</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Empresas similares a la tuya en sector y etapa. Haz clic en una para ver el detalle.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {members.map(m => (
          <div key={m.initials} style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #EAEAEA", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Avatar name={m.initials} size={36} color={cluster.color} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1A1A2E" }}>{m.match}%</span>
            </div>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13 }}>{m.name}</p>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#888" }}>{m.sub}</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: m.status === "TU" ? cluster.bgLight : m.connected ? "#E8F5E9" : "#F8F9FA",
              color: m.status === "TU" ? cluster.color : m.connected ? "#4CAF50" : "#888",
              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600
            }}>
              {m.connected && "✓ "}{m.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CONEXIONES ====================
function ConexionesPage({ user }) {
  const connections = [
    { initials: "HC", name: "Hotel Casa Bambú", sub: `${user.cluster || "Turismo"} · El Rodadero`, tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hoy", badge: "green", suggestion: "Confirma con ellos el cruce de huéspedes para el puente festivo.", messages: 3 },
    { initials: "CT", name: "Caribe Travel Co.", sub: "Agencia de turismo receptivo · Centro", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 3 días", badge: "red", suggestion: "Envía la cotización para el grupo de 10.", messages: 1 },
    { initials: "DL", name: "Doña Lucía", sub: "Lavandería a domicilio · Bastidas", tipo: "Proveedor", status: "Pendiente", lastInteraction: "Hace 5 días", badge: "yellow", suggestion: "Acepta la solicitud de conexión pendiente.", messages: 0 },
  ];

  const stats = [
    { val: 3, label: "Activas", color: "#4CAF50" },
    { val: 2, label: "Pendientes", color: "#FF9800" },
    { val: 1, label: "En pausa", color: "#9E9E9E" },
    { val: 1, label: "Archivadas", color: "#607D8B" },
  ];

  const tipoColor = { "Aliado estratégico": "#0F9B8E", "Cliente potencial": "#185FA5", "Proveedor": "#BA7517" };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Mis conexiones</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>7 negocios en tu red</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...base.card, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2"><circle cx="9" cy="9" r="6"/><path d="M19 19l-6-6"/></svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Todas 7", "Activas 3", "Pendientes 2", "En pausa 1", "Archivadas"].map(t => (
          <button key={t} style={{ background: t.startsWith("Todas") ? "#0F9B8E" : "#fff", color: t.startsWith("Todas") ? "#fff" : "#555", border: "1.5px solid", borderColor: t.startsWith("Todas") ? "#0F9B8E" : "#D8DDE5", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {connections.map(c => (
          <div key={c.initials} style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem", border: "1px solid #EAEAEA" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Avatar name={c.initials} size={40} color={tipoColor[c.tipo] || "#0F9B8E"} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{c.sub}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "#888" }}>Última interacción: {c.lastInteraction}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Badge color={tipoColor[c.tipo] || "#0F9B8E"}>{c.tipo}</Badge>
                  <Badge color={c.status === "Activa" ? "#4CAF50" : "#FF9800"}>{c.status}</Badge>
                </div>
                {c.suggestion && (
                  <div style={{ background: "#F0FBF9", borderRadius: 8, padding: "8px 12px", marginTop: 10, fontSize: 13, color: "#555" }}>
                    <span style={{ fontWeight: 600, color: "#0F9B8E" }}>El Conector sugiere: </span>{c.suggestion}
                  </div>
                )}
                {c.messages > 0 && <p style={{ fontSize: 12, color: "#888", marginTop: 6, marginBottom: 0 }}>{c.messages} mensajes intercambiados esta semana</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Btn variant="secondary" small onClick={() => window.open(`https://wa.me/573000000000`)}>WhatsApp</Btn>
              <Btn variant="ghost" small>Pausar</Btn>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "#0F9B8E", cursor: "pointer", fontWeight: 600, alignSelf: "center" }}>Ver detalle →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MI NEGOCIO (PERFIL EDITABLE) ====================
function MiNegocioPage({ user, setUserGlobal }) {
  const [tab, setTab] = useState("General");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.razonSocial?.trim()) e.razonSocial = "Obligatorio";
    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "10 dígitos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const users = loadUsers();
    const updated = { ...form };
    users[user.email] = updated;
    saveUsers(users);
    saveCurrent(updated);
    setUserGlobal(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const completitud = user.completitud || 70;

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Header card */}
      <div style={{ ...base.card, display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
        <Avatar name={user.razonSocial} size={60} color={clusterColor(user.cluster)} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>{user.razonSocial}</h1>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#888" }}>{user.cluster} · {user.etapa} · {user.municipio}</p>
          <div style={{ display: "flex", gap: 10 }}>
            {!editing && <Btn small onClick={() => setEditing(true)}>Editar perfil</Btn>}
            {editing && <><Btn small onClick={save}>Guardar cambios</Btn><Btn variant="ghost" small onClick={() => { setEditing(false); setForm({ ...user }); }}>Cancelar</Btn></>}
          </div>
          {saved && <p style={{ color: "#0F9B8E", fontSize: 13, marginTop: 8, fontWeight: 600 }}>Cambios guardados correctamente.</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          {[["Completitud del perfil", completitud + "%"], ["Empresas que te recomiendan", "4"], ["Empresas que guardaron tu perfil", "7"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, justifyContent: "flex-end" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k}</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "2px solid #EAEAEA", marginBottom: 20 }}>
        {["General", "Productos y servicios", "Programas", "Visibilidad"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", padding: "10px 18px",
            fontWeight: tab === t ? 600 : 400, color: tab === t ? "#0F9B8E" : "#555",
            borderBottom: tab === t ? "2px solid #0F9B8E" : "2px solid transparent",
            cursor: "pointer", fontSize: 14, fontFamily: base.fontFamily, marginBottom: -2
          }}>{t}</button>
        ))}
      </div>

      {tab === "General" && (
        <div style={{ ...base.card }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Datos del negocio</h3>
          {editing ? (
            <div style={{ display: "grid", gap: 14 }}>
              <Field label="Nombre / Razón Social *" error={errors.razonSocial}>
                <input value={form.razonSocial || ""} onChange={e => update("razonSocial", e.target.value)} style={errors.razonSocial ? base.inputError : base.input} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Clúster / Sector">
                  <select value={form.cluster || ""} onChange={e => update("cluster", e.target.value)} style={base.input}>
                    {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                  </select>
                </Field>
                <Field label="Etapa empresarial">
                  <select value={form.etapa || ""} onChange={e => update("etapa", e.target.value)} style={base.input}>
                    {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Municipio">
                  <select value={form.municipio || "Santa Marta"} onChange={e => { update("municipio", e.target.value); update("barrio", ""); }} style={base.input}>
                    {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Barrio o vereda">
                  <select value={form.barrio || ""} onChange={e => update("barrio", e.target.value)} style={base.input}>
                    <option value="">Selecciona</option>
                    {(MUNICIPIOS_BARRIOS[form.municipio] || []).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="WhatsApp (10 dígitos)" error={errors.whatsapp}>
                <input value={form.whatsapp || ""} maxLength={10} onChange={e => update("whatsapp", e.target.value.replace(/\D/g, ""))} style={errors.whatsapp ? base.inputError : base.input} placeholder="3158709635" />
              </Field>
              <Field label="Tiempo operando">
                <select value={form.tiempoOperando || ""} onChange={e => update("tiempoOperando", e.target.value)} style={base.input}>
                  <option value="">Selecciona</option>
                  {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Descripción del negocio">
                <textarea value={form.descripcion || ""} onChange={e => update("descripcion", e.target.value)} maxLength={280} style={{ ...base.input, minHeight: 100, resize: "vertical" }} placeholder="Describe qué hace tu negocio..." />
              </Field>
            </div>
          ) : (
            <div>
              {[
                ["NOMBRE", user.razonSocial],
                ["NIT", user.nit || "—"],
                ["SECTOR", user.cluster],
                ["ETAPA", user.etapa],
                ["TIEMPO OPERANDO", user.tiempoOperando],
                ["MUNICIPIO", user.municipio],
                ["BARRIO", user.barrio],
                ["WHATSAPP", user.whatsapp ? `+57 ${user.whatsapp}` : "—"],
                ["DESCRIPCIÓN", user.descripcion || "Sin descripción"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 20, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, minWidth: 140 }}>{k}</span>
                  <span style={{ fontSize: 14, color: "#1A1A2E" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab !== "General" && (
        <div style={{ ...base.card, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#888", fontSize: 15 }}>Esta sección estará disponible próximamente.</p>
        </div>
      )}
    </div>
  );
}

// ==================== MARKETPLACE ====================
function MarketplacePage({ user }) {
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const PRODUCT_IMAGES = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=280&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop",
  ];

  const clusterNames = ["Artesanías", "Artesanías", "Turismo", "Turismo", "Gastronomía", "Gastronomía", "Logística", "Turismo"];
  const productNames = ["Mochilas Wayuu auténticas", "Sombrero vueltiao", "Tour Sierra Nevada", "Paquete Playa Blanca", "Arepas de choclo", "Arroz de lisa", "Transporte refrigerado", "Hospedaje boutique"];
  const empresaNames = ["Artesanías Wayuu", "Tejidos del Magdalena", "TuriSierra S.A.S", "Caribe Tours", "Cocina Criolla Doña Ana", "Restaurante El Puerto", "LogisMag Ltda", "Hotel Brisas Marinas"];

  const products = PRODUCT_IMAGES.map((img, i) => ({
    id: i, cluster: clusterNames[i], nombre: productNames[i], img,
    empresa: empresaNames[i], whatsapp: "3158709635",
    desc: `Proveedor especializado en ${clusterNames[i].toLowerCase()}. Santa Marta, Magdalena.`,
    precio: `Desde $${(Math.floor(Math.random() * 90) + 10) * 1000} COP`
  }));

  const filtered = products.filter(p =>
    (!selectedCluster || p.cluster === selectedCluster) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.empresa.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "2rem", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 26 }}>Marketplace Ruta C</h1>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Productos y servicios de empresas del Magdalena</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar productos, proveedores o servicios..."
          style={{ ...base.input, paddingLeft: 40, fontSize: 15 }} />
      </div>

      {/* Cluster filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCluster(null)} style={{
          background: !selectedCluster ? "#0F9B8E" : "#fff", color: !selectedCluster ? "#fff" : "#555",
          border: "1.5px solid", borderColor: !selectedCluster ? "#0F9B8E" : "#D8DDE5",
          borderRadius: 20, padding: "7px 16px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 500
        }}>Todos</button>
        {CLUSTERS.map(c => (
          <button key={c.id} onClick={() => setSelectedCluster(c.titulo)} style={{
            background: selectedCluster === c.titulo ? c.color : "#fff",
            color: selectedCluster === c.titulo ? "#fff" : "#555",
            border: "1.5px solid", borderColor: selectedCluster === c.titulo ? c.color : "#D8DDE5",
            borderRadius: 20, padding: "7px 16px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 500
          }}>{c.titulo}</button>
        ))}
      </div>

      {/* Products grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
        {filtered.map(p => {
          const c = CLUSTERS.find(cl => cl.titulo === p.cluster) || CLUSTERS[0];
          return (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}>
              <div style={{ position: "relative" }}>
                <img src={p.img} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <Badge color={c.color}>{p.cluster}</Badge>
                <p style={{ fontWeight: 700, margin: "10px 0 4px", fontSize: 15 }}>{p.nombre}</p>
                <p style={{ color: "#666", fontSize: 13, margin: "0 0 4px" }}>{p.empresa}</p>
                <p style={{ color: "#0F9B8E", fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>{p.precio}</p>
                <Btn full small onClick={e => { e.stopPropagation(); window.open(`https://wa.me/57${p.whatsapp}?text=Hola, vi tu negocio en Ruta C y me interesa: ${p.nombre}`, "_blank"); }}>
                  Contactar por WhatsApp
                </Btn>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
          <p style={{ fontSize: 16 }}>No se encontraron resultados para tu búsqueda.</p>
        </div>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ position: "relative" }}>
              <img src={selectedProduct.img} alt="" style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
              <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              {(() => { const c = CLUSTERS.find(cl => cl.titulo === selectedProduct.cluster) || CLUSTERS[0]; return <Badge color={c.color}>{selectedProduct.cluster}</Badge>; })()}
              <h2 style={{ margin: "12px 0 4px", fontSize: 20 }}>{selectedProduct.nombre}</h2>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px" }}>{selectedProduct.empresa}</p>
              <p style={{ color: "#0F9B8E", fontWeight: 700, fontSize: 18, margin: "0 0 16px" }}>{selectedProduct.precio}</p>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>{selectedProduct.desc}</p>
              <Btn full onClick={() => window.open(`https://wa.me/57${selectedProduct.whatsapp}?text=Hola, vi tu negocio en Ruta C y me interesa: ${selectedProduct.nombre}`, "_blank")}>
                Contactar por WhatsApp
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard() {
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const users = loadUsers();
  const userList = Object.values(users);
  const total = userList.length;

  const clusterCount = CLUSTERS.reduce((acc, c) => {
    acc[c.titulo] = userList.filter(u => u.cluster === c.titulo).length;
    return acc;
  }, {});
  const etapaCount = ETAPAS.reduce((acc, e) => {
    acc[e] = userList.filter(u => u.etapa === e).length;
    return acc;
  }, {});
  const municipioCount = MUNICIPIOS.slice(0, 6).reduce((acc, m) => {
    acc[m] = userList.filter(u => u.municipio === m).length;
    return acc;
  }, {});

  const filtered = userList.filter(u =>
    u.razonSocial?.toLowerCase().includes(search.toLowerCase()) ||
    u.municipio?.toLowerCase().includes(search.toLowerCase()) ||
    u.cluster?.toLowerCase().includes(search.toLowerCase())
  );

  const KPI_DATA = [
    [total + 520, "Empresas totales", "#0F9B8E"],
    [CLUSTERS.length, "Clústeres activos", "#185FA5"],
    [MUNICIPIOS.length, "Municipios cubiertos", "#BA7517"],
    [userList.filter(u => u.etapa === "Crecimiento").length + 89, "En crecimiento", "#4CAF50"],
  ];

  return (
    <div style={{ fontFamily: base.fontFamily, minHeight: "100vh", background: "#F5F7FA" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #EAEAEA", padding: "0 2rem", display: "flex", alignItems: "center", gap: "1.5rem", height: 58, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> · Admin</span>
        </div>
        {["Dashboard", "Empresas", "Clusters", "Reportes"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: "none", border: "none", fontWeight: page === p ? 600 : 400,
            color: page === p ? "#0F9B8E" : "#555", fontSize: 14,
            borderBottom: page === p ? "2px solid #0F9B8E" : "2px solid transparent",
            padding: "20px 2px", cursor: "pointer", fontFamily: base.fontFamily
          }}>{p}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Btn variant="ghost" small onClick={() => { clearCurrent(); window.location.reload(); }}>Salir</Btn>
        </div>
      </nav>

      <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Dashboard Cámara de Comercio</h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Cámara de Comercio de Santa Marta · Vista de gestión</p>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {KPI_DATA.map(([v, l, c]) => (
            <div key={l} style={{ ...base.card }}>
              <h3 style={{ fontSize: 38, color: c, margin: "0 0 4px", fontWeight: 800 }}>{v}</h3>
              <p style={{ margin: 0, color: "#666", fontSize: 13 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Clusters distribution */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div style={{ ...base.card }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Distribución por clúster</h3>
            {CLUSTERS.map(c => {
              const count = clusterCount[c.titulo] || 0;
              const pct = total > 0 ? Math.round((count / (total + 100)) * 100) : 0;
              return (
                <div key={c.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{c.titulo}</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{count + c.total} empresas</span>
                  </div>
                  <div style={{ height: 6, background: "#F0F0F0", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${Math.max(pct, 8)}%`, background: c.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ ...base.card }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Distribución por etapa</h3>
            {ETAPAS.map(e => {
              const count = etapaCount[e] || 0;
              return (
                <div key={e} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <span style={{ fontSize: 13 }}>{e}</span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>registradas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ ...base.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Empresas registradas ({filtered.length})</h3>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar empresa..." style={{ ...base.input, width: 240, fontSize: 13, padding: "8px 12px" }} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  {["Empresa", "Municipio", "Barrio", "Clúster", "Etapa", "WhatsApp"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>No hay empresas registradas aún.</td></tr>
                )}
                {filtered.map((u, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 500 }}>{u.razonSocial}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{u.municipio}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{u.barrio}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {u.cluster && <Badge color={clusterColor(u.cluster)}>{u.cluster}</Badge>}
                    </td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{u.etapa}</td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{u.whatsapp ? `+57 ${u.whatsapp}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Inicio");

  useEffect(() => {
    const saved = loadCurrent();
    if (saved?.email) {
      setUser(saved);
      setScreen("app");
    } else {
      setScreen("register"); // Show register as landing
    }
  }, []);

  const login = (u) => { setUser(u); setScreen("app"); setPage("Inicio"); };
  const logout = () => { clearCurrent(); setUser(null); setScreen("register"); };

  if (screen === "loading") return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: base.fontFamily, color: "#888" }}>Cargando...</div>;
  if (screen === "login") return <LoginPage onLogin={login} onRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterPage onDone={login} />;

  if (user?.role === "admin") return <AdminDashboard />;

  const pages = {
    "Inicio": <InicioPage user={user} />,
    "Recomendaciones": <RecomendacionesPage user={user} />,
    "Mi clúster": <MiClusterPage user={user} />,
    "Conexiones": <ConexionesPage user={user} />,
    "Mi negocio": <MiNegocioPage user={user} setUserGlobal={u => { setUser(u); }} />,
  };

  return (
    <div style={{ fontFamily: base.fontFamily, minHeight: "100vh", background: "#F5F7FA" }}>
      <Navbar user={user} page={page} setPage={setPage} onLogout={logout} />
      <div>
        {pages[page] || <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Página no encontrada</div>}
      </div>
    </div>
  );
}