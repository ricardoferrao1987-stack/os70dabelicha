import { useState, useEffect, useCallback } from "react"
import { loadClaims, addClaim, removeClaim, subscribeClaims } from "./storage"

/* ── palette (matched to invitation) ── */
const N = "#2B4570"
const NF = "#3a5888"
const NM = "#7b93b3"
const NN = "#a8bad2"
const BG = "#F6F3EC"
const BGD = "#ECE7DB"
const GS = "#4a7350"
const GBG = "#e8f0e6"

/* ── data ── */
const ptUrl = (s, k) => `https://pt.bordallopinheiro.com/pt_PT/${s}/${k}.html`
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
const KEY = "belicha70-v4"

/* ── floral decoration (small ornament separator) ── */
const Ornament = () => (
  <svg viewBox="0 0 120 40" style={{ width: 70, opacity: 0.18, display: "block", margin: "0 auto" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke={N} strokeWidth="1.1" strokeLinecap="round">
      <path d="M15 20 Q35 18,60 20 Q85 22,105 20" />
      <ellipse cx="38" cy="15" rx="9" ry="5" transform="rotate(-12 38 15)" />
      <ellipse cx="82" cy="15" rx="9" ry="5" transform="rotate(12 82 15)" />
      <circle cx="50" cy="13" r="2.5" fill={N} opacity="0.1" />
      <circle cx="70" cy="13" r="2.5" fill={N} opacity="0.1" />
      <path d="M56 12 C56 6,64 6,64 12" />
    </g>
  </svg>
)

/* ── flower image positioned absolutely ── */
const Flowers = ({ src, style }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    style={{
      position: "absolute",
      pointerEvents: "none",
      userSelect: "none",
      ...style,
    }}
  />
)

/* ══════════════════════════════════════
   App
   ══════════════════════════════════════ */
export default function App() {
  const [cl, setCl] = useState({})
  const [form, setForm] = useState(null)
  const [nm, setNm] = useState("")
  const [qt, setQt] = useState(1)
  const [ld, setLd] = useState(true)
  const [sv, setSv] = useState(false)
  const [tab, setTab] = useState("details")

  const refresh = useCallback(async () => { setCl(await loadClaims()) }, [])

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

  const tot = pid => (cl[pid] || []).reduce((s, c) => s + (c.qty || 1), 0)
  const who = pid => cl[pid] || []
  const done = PIECES.filter(p => tot(p.id) > 0).length

  const f = "'Playfair Display',Georgia,serif"
  const s = "'Source Sans 3','Segoe UI',sans-serif"

  if (ld) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: BG }}>
      <p style={{ color: NM, fontFamily: f, fontStyle: "italic", fontSize: 16 }}>A carregar...</p>
    </div>
  )

  return (
    <div style={{ fontFamily: s, color: N, background: BG, maxWidth: 880, margin: "0 auto", position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <div style={{ position: "relative", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "3rem 2.5rem 3rem 0", overflow: "hidden" }}>

        {/* The actual invitation flowers — full strip along the left */}
        <Flowers
          src="/flowers-strip.png"
          style={{ left: -20, top: -10, height: "105%", width: "auto", opacity: 0.88 }}
        />

        {/* Text block — right-aligned, mirrors the invitation exactly */}
        <div style={{ textAlign: "right", maxWidth: 440, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: NM, margin: "0 0 30px", fontWeight: 400 }}>
            Almoço de Aniversário
          </p>

          <h1 style={{ fontFamily: f, fontSize: "clamp(52px, 11vw, 72px)", fontWeight: 700, margin: 0, color: N, lineHeight: 0.95, letterSpacing: 1 }}>
            70 anos
          </h1>

          <p style={{ fontFamily: f, fontSize: "clamp(28px, 7vw, 42px)", fontWeight: 400, color: N, margin: "8px 0 0", letterSpacing: 3 }}>
            da Belicha
          </p>

          <p style={{ fontSize: 14, fontWeight: 700, color: N, letterSpacing: 3, margin: "36px 0 0", textTransform: "uppercase" }}>
            Shhhhh! É surpresa!
          </p>

          <p style={{ fontFamily: f, fontStyle: "italic", fontSize: "clamp(22px, 5vw, 30px)", color: N, margin: "40px 0 0", fontWeight: 500 }}>
            29 . março . 2026
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, margin: "16px 0 0" }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Domingo</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: N, display: "inline-block" }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>12H30</span>
          </div>

          <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: N, margin: "40px 0 0", fontWeight: 400, lineHeight: 2 }}>
            Quinta das Lágrimas<br />Coimbra
          </p>

          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "32px 0 0", fontWeight: 400 }}>
            Confirmar até dia 8 de março
          </p>
        </div>
      </div>

      {/* ═══════════════════ NAV ═══════════════════ */}
      <div style={{ display: "flex", justifyContent: "center", gap: 48, padding: "0 2rem", position: "sticky", top: 0, background: `${BG}ee`, zIndex: 10, backdropFilter: "blur(10px)" }}>
        {[["details", "O Convite"], ["gifts", "Presente"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "18px 0", fontSize: 11, fontWeight: 400, letterSpacing: 4,
            textTransform: "uppercase", color: tab === k ? N : NM,
            background: "none", border: "none",
            borderBottom: tab === k ? `1.5px solid ${N}` : "1.5px solid transparent",
            cursor: "pointer", fontFamily: s, transition: "all 0.3s"
          }}>{l}</button>
        ))}
      </div>

      {/* ═══════════════════ DETAILS ═══════════════════ */}
      {tab === "details" && (
        <div style={{ padding: "4rem 2rem 5rem", textAlign: "center", position: "relative" }}>
          {/* Subtle mirrored flowers on the right */}
          <Flowers
            src="/flowers-top.png"
            style={{ right: -30, top: -10, width: 200, opacity: 0.1, transform: "scaleX(-1)" }}
          />

          <div style={{ maxWidth: 400, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: f, fontStyle: "italic", fontSize: 30, color: N, margin: "0 0 32px", lineHeight: 1.3 }}>
              29 . março . 2026
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 36 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Domingo</span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: N, display: "inline-block" }} />
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>12H30</span>
            </div>

            <Ornament />

            <div style={{ margin: "36px 0" }}>
              <p style={{ fontFamily: f, fontSize: 22, fontWeight: 500, color: N, margin: "0 0 6px", letterSpacing: 2 }}>Quinta das Lágrimas</p>
              <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: 0, fontWeight: 400 }}>Coimbra</p>
            </div>

            <div style={{ margin: "48px 0" }}>
              <p style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "0 0 8px" }}>Confirmar presença</p>
              <p style={{ fontSize: 16, color: N, margin: 0, fontWeight: 400 }}>Até dia <strong style={{ fontWeight: 600 }}>8 de Março</strong></p>
            </div>

            <Ornament />

            <p style={{ fontSize: 15, color: N, margin: "36px 0 0", lineHeight: 1.8, fontStyle: "italic", fontFamily: f }}>
              Isto é uma festa surpresa —<br />por favor não comentem nada com a Belicha!
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════ GIFTS ═══════════════════ */}
      {tab === "gifts" && (
        <div style={{ padding: "4rem 2rem 4rem", position: "relative" }}>
          {/* Subtle floral accent */}
          <Flowers
            src="/flowers-bottom.png"
            style={{ right: -60, top: 40, width: 220, opacity: 0.06, transform: "scaleX(-1)" }}
          />

          {/* Intro */}
          <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 3.5rem", position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: f, fontStyle: "italic", fontSize: 28, color: N, margin: "0 0 20px", lineHeight: 1.3 }}>Presente Comum</p>
            <Ornament />
            <p style={{ color: NF, fontSize: 14, lineHeight: 2, fontWeight: 300, marginTop: 20 }}>
              Vamos juntar-nos para oferecer à Belicha a coleção{" "}
              <strong style={{ fontWeight: 600, color: N }}>Olival</strong> da{" "}
              <a href={colUrl} target="_blank" rel="noopener noreferrer" style={{ color: N, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${NN}` }}>Bordallo Pinheiro</a>
              {" "}— cerâmica artesanal pintada à mão, inspirada na oliveira e na paisagem alentejana.
            </p>

            <div style={{ margin: "24px auto", padding: "20px 24px", background: "rgba(43,69,112,0.03)", borderRadius: 12, border: `1px solid rgba(43,69,112,0.06)`, maxWidth: 420 }}>
              <p style={{ fontFamily: f, fontStyle: "italic", fontSize: 15, color: N, margin: "0 0 8px", lineHeight: 1.6 }}>Como funciona?</p>
              <p style={{ color: NF, fontSize: 13, lineHeight: 1.9, fontWeight: 300, margin: 0 }}>
                Cada pessoa escolhe a peça (ou peças) que quer oferecer e trata de a comprar — no site da Bordallo Pinheiro ou numa loja. Esta lista serve apenas para nos coordenarmos e evitar repetidos.
              </p>
            </div>

            <p style={{ color: NM, fontSize: 13, lineHeight: 1.7, fontWeight: 300 }}>
              Clica no nome da peça para a ver no site. Reserva aqui com o teu nome.
            </p>
          </div>

          {/* Progress */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: NM, margin: "0 0 10px" }}>Peças reservadas</p>
            <p style={{ fontFamily: f, fontSize: 32, fontWeight: 600, color: N, margin: 0 }}>
              {done}<span style={{ fontWeight: 400, color: NM, fontSize: 20 }}> / {PIECES.length}</span>
            </p>
          </div>

          {/* Pieces */}
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
                  const hasMax = p.multi && p.max
                  const full = hasMax && tc >= p.max
                  const open = form === p.id
                  const remaining = hasMax ? p.max - tc : 99

                  return (
                    <div key={p.id} style={{
                      padding: "20px 0",
                      borderTop: pi === 0 ? `1px solid ${BGD}` : "none",
                      borderBottom: `1px solid ${BGD}`,
                    }}>
                      {/* Piece header row */}
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1, minWidth: 200 }}>
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: f, fontSize: 18, fontWeight: 500, color: N, textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}
                            onMouseEnter={e => e.target.style.borderBottomColor = NN}
                            onMouseLeave={e => e.target.style.borderBottomColor = "transparent"}
                          >{p.name}</a>
                          {tc > 0 && !hasMax && <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GS, fontWeight: 500 }}>reservado</span>}
                          {full && <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GS, fontWeight: 500 }}>completo</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                          <span style={{ fontSize: 12, color: NM, fontWeight: 300, fontStyle: "italic" }}>{p.desc}</span>
                          <span style={{ fontFamily: f, fontSize: 16, fontWeight: 500, color: N, whiteSpace: "nowrap" }}>{p.price}€{hasMax ? " /un." : ""}</span>
                        </div>
                      </div>

                      {/* Multi-unit progress */}
                      {hasMax && (
                        <div style={{ marginTop: 10, maxWidth: 200 }}>
                          <div style={{ height: 2, background: BGD, borderRadius: 1, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 1, background: tc >= p.max ? GS : N, width: `${(tc / p.max) * 100}%`, transition: "width 0.4s", opacity: 0.6 }} />
                          </div>
                          <p style={{ fontSize: 11, color: NM, margin: "4px 0 0", fontWeight: 300 }}>{tc} de {p.max} unidades</p>
                        </div>
                      )}

                      {/* Who claimed */}
                      {claimers.length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {claimers.map((c, i) => (
                            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: GBG, borderRadius: 100, fontSize: 12, color: GS, fontWeight: 500 }}>
                              {c.name}{c.qty > 1 ? ` ×${c.qty}` : ""}
                              <button onClick={() => del(p.id, i)} style={{ background: "none", border: "none", color: "#b8c0ab", fontSize: 10, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Claim button */}
                      {!full && !open && (
                        <button onClick={() => { setForm(p.id); setQt(1) }}
                          style={{ marginTop: 12, padding: "8px 20px", background: "none", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 11, color: NM, cursor: "pointer", letterSpacing: 2, fontFamily: s, textTransform: "uppercase", fontWeight: 400, transition: "all 0.25s" }}
                          onMouseEnter={e => { e.target.style.borderColor = N; e.target.style.color = N }}
                          onMouseLeave={e => { e.target.style.borderColor = BGD; e.target.style.color = NM }}
                        >Eu ofereço</button>
                      )}

                      {/* Inline form */}
                      {open && (
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <input type="text" placeholder="O teu nome" value={nm} onChange={e => setNm(e.target.value)} autoFocus
                            style={{ padding: "8px 14px", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 13, fontFamily: s, background: "transparent", outline: "none", color: N, width: 180 }}
                            onFocus={e => e.target.style.borderColor = NM}
                            onBlur={e => e.target.style.borderColor = BGD}
                            onKeyDown={e => { if (e.key === "Enter" && nm.trim()) save(p.id, nm.trim(), qt) }}
                          />
                          {hasMax && remaining > 0 && (
                            <select value={qt} onChange={e => setQt(+e.target.value)} style={{ padding: "8px 12px", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 13, fontFamily: s, background: "transparent", color: N }}>
                              {Array.from({ length: Math.min(remaining, 6) }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} un.</option>)}
                            </select>
                          )}
                          <button onClick={() => { if (nm.trim()) save(p.id, nm.trim(), qt) }} disabled={!nm.trim() || sv}
                            style={{ padding: "8px 20px", background: nm.trim() ? N : BGD, color: nm.trim() ? BG : NM, border: "none", borderRadius: 100, fontSize: 11, fontWeight: 500, cursor: nm.trim() ? "pointer" : "default", letterSpacing: 2, fontFamily: s, textTransform: "uppercase" }}>{sv ? "..." : "Confirmar"}</button>
                          <button onClick={() => { setForm(null); setNm("") }}
                            style={{ padding: "8px 16px", background: "none", border: `1px solid ${BGD}`, borderRadius: 100, fontSize: 11, color: NM, cursor: "pointer", fontFamily: s, letterSpacing: 1 }}>Cancelar</button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 40, position: "relative" }}>
            <Flowers
              src="/flowers-top.png"
              style={{ left: "50%", top: -30, width: 60, opacity: 0.1, transform: "translateX(-50%) rotate(180deg)" }}
            />
            <Ornament />
            <p style={{ fontSize: 12, color: NM, fontWeight: 300, lineHeight: 1.9, maxWidth: 420, margin: "20px auto 0" }}>
              Cada pessoa pode comprar a sua peça no{" "}
              <a href={colUrl} target="_blank" rel="noopener noreferrer" style={{ color: N, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${NN}` }}>
                site da Bordallo Pinheiro
              </a>{" "}ou numa loja.
            </p>
            <p style={{ fontFamily: f, fontStyle: "italic", fontSize: 14, color: NM, marginTop: 28, opacity: 0.5 }}>
              Feito com carinho para a Belicha
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
