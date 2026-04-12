export const PIVOT_CURRENCIES = ['USD', 'EUR', 'XAF', 'GHS']
export const CURRENCIES = ['USD', 'EUR', 'XAF', 'GHS', 'GBP', 'CAD', 'CHF', 'JPY', 'NGN', 'MAD', 'CFA', 'XOF']
export const PALETTE = [
  '#6C63FF','#F43F5E','#10B981','#F59E0B','#06B6D4','#EC4899',
  '#8B5CF6','#EF4444','#22C55E','#F97316','#0EA5E9','#A855F7',
  '#14B8A6','#EAB308','#FF5733','#0284C7',
]
export const DEFAULT_CATEGORIES = [
  { name: 'Food',      color: '#6C63FF' },
  { name: 'Transport', color: '#F43F5E' },
  { name: 'Design',    color: '#06B6D4' },
  { name: 'Logement',  color: '#F59E0B' },
  { name: 'Salaire',   color: '#22C55E' },
  { name: 'Client',    color: '#F97316' },
  { name: 'Loisirs',   color: '#EC4899' },
  { name: 'Transfert', color: '#A855F7' },
]
export const FALLBACK_RATES = {
  USD:1, EUR:0.92, XAF:603, GHS:15.8, GBP:0.79,
  NGN:1580, MAD:10.1, CAD:1.36, CHF:0.9, JPY:149, CFA:603, XOF:603
}

export function fmt(n, cur, dec = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: cur,
      minimumFractionDigits: dec, maximumFractionDigits: dec
    }).format(n)
  } catch { return `${n.toFixed(dec)} ${cur}` }
}

export function fmtShort(n, cur) {
  if (!n && n !== 0) return '—'
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M ${cur}`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K ${cur}`
  return fmt(n, cur)
}

export const isXAF = c => ['XAF','GHS','NGN','CFA','XOF'].includes(c)

export function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('')
}

export function greeting(name) {
  const h = new Date().getHours()
  if (h < 12) return `Good morning, ${name}`
  if (h < 18) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}
