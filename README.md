# 🫒 70 Anos da Belicha

Página da festa surpresa com coordenação de presente comum (coleção Olival, Bordallo Pinheiro).

## Setup rápido (10 min)

### 1. Supabase (base de dados gratuita)

1. Vai a [supabase.com](https://supabase.com) e cria uma conta/projecto gratuito
2. No projecto, vai a **SQL Editor** e cola o conteúdo de `supabase-setup.sql` → **Run**
3. Vai a **Settings → API** e copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Local

```bash
npm install
cp .env.example .env
# Preenche o .env com os valores do Supabase
npm run dev
```

### 3. Deploy no Vercel

```bash
# Opção A: via CLI
npm i -g vercel
vercel

# Opção B: via GitHub
# Push para um repo e importa em vercel.com/new
```

No Vercel, vai a **Settings → Environment Variables** e adiciona:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Done. O Vercel detecta o Vite automaticamente.

## Sem Supabase?

Se não configurares o Supabase, a app funciona na mesma com `localStorage` (os dados ficam no browser de cada pessoa, não são partilhados). Funciona para testar mas não para uso real com convidados.

## Stack

- Vite + React
- Supabase (PostgreSQL + real-time)
- Vercel (hosting)
