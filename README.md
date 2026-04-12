# Winance — Multi-currency personal finance

## Deploy in 5 minutes

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create winance --public --push
```

### 2. Deploy on Vercel
1. Go to vercel.com → New Project → Import your GitHub repo
2. Framework: **Vite**
3. Add environment variables:
   - `VITE_SUPABASE_URL` = https://ikqbnsqqwsufbkqdvvcy.supabase.co
   - `VITE_SUPABASE_ANON_KEY` = (your anon key from .env)
4. Click Deploy

### 3. Enable Email Auth in Supabase
1. Go to supabase.com → your Winance project
2. Authentication → Providers → Email → Enable
3. Optionally disable "Confirm email" for easier onboarding

### 4. Add your domain (optional)
- In Vercel: Settings → Domains → Add `winance.app` or any domain you own
- In Supabase: Authentication → URL Configuration → Add your domain to allowed redirect URLs

## Local development
```bash
npm install
npm run dev
```

## Tech stack
- React + Vite
- Supabase (Auth + PostgreSQL)
- Recharts
- Deployed on Vercel
