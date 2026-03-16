import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null

// ── CRUD ──

export async function loadClaims() {
  if (!supabase) return loadLocal()
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error(error); return loadLocal() }
  // Group by piece_id → { [piece_id]: [{ name, qty, id }] }
  const grouped = {}
  for (const row of data) {
    if (!grouped[row.piece_id]) grouped[row.piece_id] = []
    grouped[row.piece_id].push({ name: row.guest_name, qty: row.qty, id: row.id })
  }
  return grouped
}

export async function addClaim(pieceId, name, qty) {
  if (!supabase) return addLocal(pieceId, name, qty)
  const { data, error } = await supabase
    .from('claims')
    .insert({ piece_id: pieceId, guest_name: name, qty })
    .select()
    .single()
  if (error) { console.error(error); throw error }
  return { name: data.guest_name, qty: data.qty, id: data.id }
}

export async function removeClaim(claimId) {
  if (!supabase) return removeLocal(claimId)
  const { error } = await supabase.from('claims').delete().eq('id', claimId)
  if (error) { console.error(error); throw error }
}

// ── Subscribe to real-time changes ──

export function subscribeClaims(onUpdate) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('claims-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
      onUpdate()
    })
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// ── localStorage fallback (dev / no Supabase) ──

const LS_KEY = 'belicha70-claims'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

function saveLocal(claims) {
  localStorage.setItem(LS_KEY, JSON.stringify(claims))
}

function addLocal(pieceId, name, qty) {
  const claims = loadLocal()
  if (!claims[pieceId]) claims[pieceId] = []
  const entry = { name, qty, id: `local-${Date.now()}` }
  claims[pieceId].push(entry)
  saveLocal(claims)
  return entry
}

function removeLocal(claimId) {
  const claims = loadLocal()
  for (const pid of Object.keys(claims)) {
    claims[pid] = claims[pid].filter(c => c.id !== claimId)
    if (!claims[pid].length) delete claims[pid]
  }
  saveLocal(claims)
}
