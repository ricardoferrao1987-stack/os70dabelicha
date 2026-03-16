import { useState, useEffect, useCallback } from "react"
import { loadClaims, addClaim, removeClaim, subscribeClaims } from "./storage"

const N = "#2B4570"
const NF = "#3a5888"
const NM = "#7b93b3"
const NN = "#a8bad2"
const BG = "#F6F3EC"
const BGD = "#ECE7DB"
const GS = "#4a7350"
const GBG = "#e8f0e6"

const ptUrl = (slug, sku) => `https://pt.bordallopinheiro.com/pt_PT/${slug}/${sku}.html`
const colUrl = "https://pt.bordallopinheiro.com/pt_PT/colecoes/olival-1/"

const PIECES = [
  { id: "pitcher", name: "Jarro 2.5L", price: 128, url: ptUrl("jarro", "65032000"), desc: "Centro de mesa escultórico", cat: 0 },
  { id: "salad-bowl", name: "Saladeira 35cm", price: 75, url: ptUrl("saladeira", "65031999"), desc: "Para pratos sazonais", cat: 0 },
  { id: "cheese-tray", name: "Queijeira", price: 75, url: ptUrl("queijeira", "65031998"), desc: "Para queijos com elegância", cat: 0 },
  { id: "large-platter", name: "Travessa 40cm", price: 58, url: ptUrl("travessa-grande", "65031940"), desc: "Aperitivos em grande estilo", cat: 0 },
  { id: "set-platter-bowls", name: "Conj. Travessa + 3 Taças", price: 98, url: ptUrl("conjunto-travessa-3-tacas", "65031948"), desc: "Petiscos e entradas", cat: 0 },
  { id: "dinner-plate", name: "Prato Raso", price: 28, url: ptUrl("prato-raso", "65032432"), desc: "Dia-a-dia com charme", cat: 1, multi: true, max: 8 },
  { id: "pasta-plate", name: "Prato Pasta", price: 30, url: ptUrl("prato-pasta", "65032422"), desc: "Massas e molhos", cat: 1, multi: true, max: 8 },
  { id: "starter-plate", name: "Prato Sobremesa", price: 30, url: ptUrl("prato-sobremesa", "65031883"), desc: "Sobremesas e entradas", cat: 1, multi: true, max: 8 },
  { id: "small-bowl", name: "Taça Pequena", price: 14, url: colUrl, desc: "Molhos, azeitonas, azeite", cat: 2, multi: true, max: 6 },
  { id: "large-vase", name: "Jarra Grande", price: 650, url: ptUrl("jarra-grande", "65004956"), desc: "A jóia da coleção", cat: 3 },
]
const CATS = ["Peças de Servir", "Pratos", "Taças", "Arte Bordallo"]

/* ══════════════════════════════════════════
   Botanical Illustrations (invitation style)
   ══════════════════════════════════════════ */

const Roses = ({ side = "left", top = 0, scale = 1, opacity = 0.14 }) => (
  <svg viewBox="0 0 340 680" style={{ position: "absolute", [side]: -40, top, width: 280 * scale, opacity, pointerEvents: "none", transform: side === "right" ? "scaleX(-1)" : "none" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke={N} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M200 15 C185 45,175 85,168 130 C160 180,155 230,158 290 C162 350,155 420,148 490 C142 550,150 610,165 670" />
      <path d="M195 20 C210 10,225 15,230 30 C235 45,225 55,210 50 C195 45,190 35,195 20" fill={N} opacity="0.07" />
      <path d="M210 50 C225 42,240 48,243 63 C246 78,235 87,220 82 C205 77,200 65,210 50" fill={N} opacity="0.06" />
      <path d="M230 30 C245 25,255 32,258 45 C261 58,252 66,240 62" fill={N} opacity="0.05" />
      <path d="M195 25 C180 18,168 25,166 38 C164 51,175 58,188 52" fill={N} opacity="0.06" />
      <path d="M220 55 Q250 40,265 55 Q280 70,260 80 Q240 90,225 75" />
      <path d="M205 45 Q175 30,160 48 Q145 66,168 75 Q185 82,200 68" />
      <path d="M240 68 C255 60,268 65,272 78 C276 91,268 100,254 96 C240 92,235 80,240 68" fill={N} opacity="0.05" />
      <path d="M260 25 Q278 18,285 32 Q292 46,275 52" />
      <path d="M155 45 Q138 38,132 52 Q126 66,142 72" />
      <path d="M228 85 C215 95,210 115,218 128 C226 141,245 138,252 125 C259 112,248 95,235 88" fill={N} opacity="0.04" />
      <path d="M235 90 Q260 85,268 105 Q276 125,255 132 Q234 139,228 118" />
      <path d="M222 95 Q195 92,188 112 Q181 132,202 138 Q220 142,228 122" />
      <path d="M242 128 Q258 120,265 135 Q272 150,255 155" />
      <path d="M215 130 Q198 125,192 140 Q186 155,202 160" />
      <path d="M175 100 Q160 90,148 100 C136 110,140 128,155 132 C170 136,178 120,175 108" />
      <path d="M165 105 Q145 100,138 115 Q131 130,150 135" />
      <path d="M180 115 Q198 108,205 120" />
      <path d="M160 175 C148 165,132 170,128 185 C124 200,136 210,150 205 C164 200,168 188,160 175" fill={N} opacity="0.06" />
      <path d="M150 178 Q130 172,122 188 Q115 204,135 210 Q152 215,158 198" />
      <path d="M165 182 Q185 175,190 192 Q195 209,175 214 Q158 218,155 200" />
      <path d="M140 210 C128 218,125 235,135 245 C145 255,162 250,165 238 C168 226,155 215,142 212" fill={N} opacity="0.04" />
      <path d="M148 215 Q165 210,172 228 Q179 246,160 252 Q142 256,138 238" />
      <path d="M135 220 Q118 216,112 233 Q106 250,125 255 Q140 258,145 240" />
      <path d="M178 200 C190 195,202 200,205 212 C208 224,198 232,186 228 C174 224,170 210,178 200" fill={N} opacity="0.05" />
      <path d="M185 205 Q205 198,210 215 Q215 232,196 236 Q180 240,178 222" />
      <path d="M172 208 Q155 204,150 218 Q145 232,162 237" />
      <path d="M195 160 C182 158,174 168,178 180 C182 192,196 194,200 182 C204 170,195 160,195 160" fill={N} opacity="0.04" />
      <ellipse cx="170" cy="290" rx="25" ry="14" transform="rotate(-18 170 290)" />
      <ellipse cx="145" cy="340" rx="22" ry="12" transform="rotate(15 145 340)" />
      <ellipse cx="160" cy="395" rx="24" ry="13" transform="rotate(-12 160 395)" />
      <ellipse cx="148" cy="450" rx="20" ry="11" transform="rotate(18 148 450)" />
      <ellipse cx="155" cy="510" rx="22" ry="12" transform="rotate(-15 155 510)" />
      <ellipse cx="165" cy="570" rx="18" ry="10" transform="rotate(12 165 570)" />
      <ellipse cx="158" cy="630" rx="20" ry="11" transform="rotate(-10 158 630)" />
      <circle cx="162" cy="315" r="5" fill={N} opacity="0.07" />
      <circle cx="150" cy="370" r="4.5" fill={N} opacity="0.06" />
      <circle cx="158" cy="425" r="5" fill={N} opacity="0.05" />
      <circle cx="148" cy="480" r="4" fill={N} opacity="0.06" />
      <circle cx="160" cy="540" r="4.5" fill={N} opacity="0.05" />
      <circle cx="155" cy="600" r="4" fill={N} opacity="0.06" />
      <path d="M185 275 Q200 268,208 280 Q216 292,200 298" />
      <path d="M135 325 Q118 320,112 335 Q106 350,122 355" />
      <path d="M175 380 Q192 374,198 388" />
      <path d="M132 440 Q115 435,110 448" />
      <path d="M170 500 Q186 495,190 508" />
      <path d="M140 560 Q124 556,120 568" />
    </g>
  </svg>
)

const SmallFloral = ({ style }) => (
  <svg viewBox="0 0 120 60" style={{ width: 80, opacity: 0.12, ...style }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke={N} strokeWidth="1.2" strokeLinecap="round">
      <path d="M10 30 Q30 28,60 30 Q90 32,110 30" />
      <ellipse cx="35" cy="25" rx="10" ry="6" transform="rotate(-15 35 25)" />
      <ellipse cx="85" cy="25" rx="10" ry="6" transform="rotate(15 85 25)" />
      <circle cx="48" cy="22" r="3" fill={N} opacity="0.08" />
      <circle cx="72" cy="22" r="3" fill={N} opacity="0.08" />
      <path d="M55 20 C55 12,65 12,65 20 C65 12,75 12,75 20" />
      <path d="M45 20 C45 12,35 12,35 20" />
    </g>
  </svg>
)

/* ══════════════════════════════════════════
   Main App
   ══════════════════════════════════════════ */

export default function App() {
  const [cl, setCl] = useState({})
  const [form, setForm] = useState(null)
  const [nm, setNm] = useState("")
  const [qt, setQt] = useState(1)
  const [ld, setLd] = useState(true)
  const [sv, setSv] = useState(false)
  const [tab, setTab] = useState("gifts")

  const refresh = useCallback(async () => {
    const data = await loadClaims()
    setCl(data)
  }, [])

  useEffect(() => {
    refresh().finally(() => setLd(false))
    const unsub = subscribeClaims(() => refresh())
    return unsub
  }, [refresh])

  const save = async (pid, n, q) => {
    setSv(true)
    try {
      const entry = await addClaim(pid, n, q)
      setCl(prev => {
        const u = { ...prev }
        if (!u[pid]) u[pid] = []
        u[pid] = [...u[pid], entry]
        return u
      })
    } catch { alert("Erro ao guardar. Tenta novamente.") }
    setSv(false); setForm(null); setNm(""); setQt(1)
  }

  const del = async (pid, i) => {
    const entry = cl[pid]?.[i]
    if (!entry || !window.confirm(`Remover ${entry.name}?`)) return
    try {
      await removeClaim(entry.id)
      setCl(prev => {
        const u = { ...prev }
        u[pid] = u[pid].filter((_, j) => j !== i)
        if (!u[pid].length) delete u[pid]
        return u
      })
    } catch {}
  }

  const tot = (pid) => (cl[pid] || []).reduce((s, c) => s + (c.qty || 1), 0)
  const who = (pid) => cl[pid] || []
  const done = PIECES.filter(p => tot(p.id) > 0).length

  const font = "'Playfair Display',Georgia,serif"
  const sans = "'Source Sans 3','Segoe UI',sans-serif"

  if (ld) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: BG }}><p style={{ color: NM, fontFamily: font, fontStyle: "italic", fontSize: 16 }}>A carregar...</p></div>

  return (
    <div style={{ fontFamily: sans, color: N, background: BG, maxWidth: 880, margin: "0 auto", position: "relative", overflow: "hidden", minHeight: "100vh" }}>

      {/* ════ HERO ════ */}
      <div style={{ position: "relative", minHeight: 520, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4rem 2rem 3rem", overflow: "hidden" }}>
        <Roses side="left" top={-30} scale={1.15} opacity={0.16} />

        <div style={{ textAlign: "right", maxWidth: 420, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: NM, margin: "0 0 28px", fontWeight: 400 }}>Almoço de Aniversário</p>
          <h1 style={{ fontFamily: font, fontSize: "clamp(48px, 10vw, 68px)", fontWeight: 700, margin: 0, color: N, lineHeight: 0.95 }}>70 anos</h1>
          <p style={{ fontFamily: font, fontSize: "clamp(26px, 6vw, 38px)", fontWeight: 400, color: N, margin: "10px 0 0", letterSpacing: 3 }}>da Belicha</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: N, letterSpacing: 3, margin: "32px 0 0", textTransform: "uppercase" }}>Shhhhh! É surpresa!</p>
          <p style={{ fontFamily: font, fontStyle: "italic", fontSize: "clamp(22px, 5vw, 28px)", color: N, margin: "36px 0 0", fontWeight: 500 }}>29 . março . 2026</p>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, margin: "14px 0 0" }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Domingo</span>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: N, display: "inline-block" }} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>12H30</span>
          </div>
          <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: N, margin: "36px 0 0", fontWeight: 400, lineHeight: 1.8 }}>Quinta das Lágrimas<br />Coimbra</p>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "28px 0 0", fontWeight: 400 }}>Confirmar até dia 8 de março</p>
        </div>
      </div>

      {/* ════ NAV ════ */}
      <div style={{ display: "flex", justifyContent: "center", gap: 48, padding: "0 2rem", position: "sticky", top: 0, background: `${BG}ee`, zIndex: 10, backdropFilter: "blur(10px)" }}>
        {[["details", "Detalhes"], ["gifts", "Presente"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "18px 0", fontSize: 11, fontWeight: 400, letterSpacing: 4, textTransform: "uppercase", color: tab === k ? N : NM, background: "none", border: "none", borderBottom: tab === k ? `1.5px solid ${N}` : "1.5px solid transparent", cursor: "pointer", fontFamily: sans, transition: "all 0.3s" }}>{l}</button>
        ))}
      </div>

      {/* ════ DETAILS ════ */}
      {tab === "details" && (
        <div style={{ padding: "4rem 2rem 5rem", textAlign: "center", position: "relative" }}>
          <Roses side="right" top={-60} scale={0.7} opacity={0.08} />
          <div style={{ maxWidth: 400, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: font, fontStyle: "italic", fontSize: 30, color: N, margin: "0 0 32px", lineHeight: 1.3 }}>29 . março . 2026</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Domingo</span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: N, display: "inline-block" }} />
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>12H30</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}><SmallFloral /></div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 500, color: N, margin: "0 0 6px", letterSpacing: 2 }}>Quinta das Lágrimas</p>
            <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "0 0 48px", fontWeight: 400 }}>Coimbra</p>
            <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "0 0 6px" }}>Confirmar presença</p>
            <p style={{ fontSize: 16, color: N, margin: "0 0 48px", fontWeight: 400 }}>Até dia <strong style={{ fontWeight: 600 }}>8 de Março</strong></p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}><SmallFloral /></div>
            <p style={{ fontSize: 15, color: N, margin: 0, lineHeight: 1.8, fontStyle: "italic", fontFamily: font }}>Isto é uma festa surpresa —<br />por favor não comentem nada com a Belicha!</p>
          </div>
        </div>
      )}

      {/* ════ GIFTS ════ */}
      {tab === "gifts" && (
        <div style={{ padding: "4rem 2rem 4rem", position: "relative" }}>
          <Roses side="right" top={-40} scale={0.6} opacity={0.06} />

          <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 3.5rem" }}>
            <p style={{ fontFamily: font, fontStyle: "italic", fontSize: 28, color: N, margin: "0 0 20px", lineHeight: 1.3 }}>Presente Comum</p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><SmallFloral /></div>
            <p style={{ color: NF, fontSize: 14, lineHeight: 2, fontWeight: 300 }}>
              Vamos juntar-nos para oferecer à Belicha a coleção{" "}
              <strong style={{ fontWeight: 600, color: N }}>Olival</strong> da{" "}
              <a href={colUrl} target="_blank" rel="noopener noreferrer" style={{ color: N, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${NN}` }}>Bordallo Pinheiro</a>
              {" "}— cerâmica artesanal pintada à mão, inspirada na oliveira e na paisagem alentejana.
            </p>
            <p style={{ color: NM, fontSize: 13, lineHeight: 1.7, fontWeight: 300, marginTop: 12 }}>Clica no nome da peça para a ver no site. Clica em "Eu ofereço" para reservar.</p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "0 0 10px" }}>Peças reservadas</p>
            <p style={{ fontFamily: font, fontSize: 32, fontWeight: 600, color: N, margin: 0 }}>{done}<span style={{ fontWeight: 400, color: NM, fontSize: 20 }}> / {PIECES.length}</span></p>
          </div>

          {CATS.map((cat, ci) => {
            const ps = PIECES.filter(p => p.cat === ci)
            if (!ps.length) return null
            return (
              <div key={cat} style={{ marginBottom: 48 }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: NM, margin: 0, fontWeight: 500 }}>{cat}</p>
                </div>

                {ps.map((p, pi) => {
                  const claimers = who(p.id)
                  const tc = tot(p.id)
                  const full = p.multi ? tc >= p.max : tc > 0
                  const open = form === p.id

                  return (
                    <div key={p.id} style={{ padding: "20px 0", borderTop: pi === 0 ? `1px solid ${BGD}` : "none", borderBottom: `1px solid ${BGD}` }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1, minWidth: 200 }}>
                          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: font, fontSize: 18, fontWeight: 500, color: N, textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}
                            onMouseEnter={e => e.target.style.borderBottomColor = NN}
                            onMouseLeave={e => e.target.style.borderBottomColor = "transparent"}
                          >{p.name}</a>
                          {full && <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GS, fontWeight: 500 }}>reservado</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                          <span style={{ fontSize: 12, color: NM, fontWeight: 300, fontStyle: "italic" }}>{p.desc}</span>
                          <span style={{ fontFamily: font, fontSize: 16, fontWeight: 500, color: N, whiteSpace: "nowrap" }}>{p.price}€</span>
                        </div>
                      </div>

                      {p.multi && (
                        <div style={{ marginTop: 10, maxWidth: 200 }}>
                          <div style={{ height: 2, background: BGD, borderRadius: 1, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 1, background: tc >= p.max ? GS : N, width: `${(tc / p.max) * 100}%`, transition: "width 0.4s", opacity: 0.6 }} />
                          </div>
                          <p style={{ fontSize: 11, color: NM, margin: "4px 0 0", fontWeight: 300 }}>{tc} de {p.max} unidades</p>
                        </div>
                      )}

                      {claimers.length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {claimers.map((c, i) => (
                            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: GBG, borderRadius: 100, fontSize: 12, color: GS, fontWeight: 500 }}>
                              {c.name}{p.multi && c.qty > 1 ? ` ×${c.qty}` : ""}
                              <button onClick={() => del(p.id, i)} style={{ background: "none", border: "none", color: "#b8c0ab", fontSize: 10, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {!full && !open && (
                        <button onClick={() => { setForm(p.id); setQt(1) }} style={{ marginTop: 12, padding: "8px 20px", background: "none", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 11, color: NM, cursor: "pointer", letterSpacing: 2, fontFamily: sans, textTransform: "uppercase", fontWeight: 400, transition: "all 0.25s" }}
                          onMouseEnter={e => { e.target.style.borderColor = N; e.target.style.color = N }}
                          onMouseLeave={e => { e.target.style.borderColor = BGD; e.target.style.color = NM }}
                        >Eu ofereço</button>
                      )}

                      {open && (
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <input type="text" placeholder="O teu nome" value={nm} onChange={e => setNm(e.target.value)} autoFocus
                            style={{ padding: "8px 14px", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 13, fontFamily: sans, background: "transparent", outline: "none", color: N, width: 180 }}
                            onFocus={e => e.target.style.borderColor = NM}
                            onBlur={e => e.target.style.borderColor = BGD}
                            onKeyDown={e => { if (e.key === "Enter" && nm.trim()) save(p.id, nm.trim(), p.multi ? qt : 1) }}
                          />
                          {p.multi && (
                            <select value={qt} onChange={e => setQt(+e.target.value)} style={{ padding: "8px 12px", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 13, fontFamily: sans, background: "transparent", color: N }}>
                              {Array.from({ length: Math.min(p.max - tc, 4) }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} un.</option>)}
                            </select>
                          )}
                          <button onClick={() => { if (nm.trim()) save(p.id, nm.trim(), p.multi ? qt : 1) }}
                            disabled={!nm.trim() || sv}
                            style={{ padding: "8px 20px", background: nm.trim() ? N : BGD, color: nm.trim() ? BG : NM, border: "none", borderRadius: 100, fontSize: 11, fontWeight: 500, cursor: nm.trim() ? "pointer" : "default", letterSpacing: 2, fontFamily: sans, textTransform: "uppercase" }}>{sv ? "..." : "Confirmar"}</button>
                          <button onClick={() => { setForm(null); setNm("") }}
                            style={{ padding: "8px 16px", background: "none", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 11, color: NM, cursor: "pointer", fontFamily: sans, letterSpacing: 1 }}>Cancelar</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><SmallFloral /></div>
            <p style={{ fontSize: 12, color: NM, fontWeight: 300, lineHeight: 1.9, maxWidth: 420, margin: "0 auto" }}>
              As peças serão compradas em conjunto.<br />
              <a href={colUrl} target="_blank" rel="noopener noreferrer" style={{ color: N, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${NN}` }}>Ver a coleção Olival no site da Bordallo Pinheiro</a>
            </p>
            <p style={{ fontFamily: font, fontStyle: "italic", fontSize: 14, color: NM, marginTop: 28, opacity: 0.5 }}>Feito com carinho para a Belicha</p>
          </div>
        </div>
      )}
    </div>
  )
}
