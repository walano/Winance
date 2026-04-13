// All currencies — ordered: FCFA, EUR, USD, GHS first, then rest alphabetically
export const ALL_CURRENCIES = [
  'XAF','EUR','USD','GHS',
  'AED','AUD','BRL','CAD','CHF','CNY','COP','DKK','ETB',
  'GBP','IDR','INR','JPY','KES','MAD','MXN','NGN','NOK',
  'PKR','RWF','SAR','SEK','SGD','TND','TZS','UGX','XOF','ZAR',
]

export const CURRENCIES = ALL_CURRENCIES
export const PIVOT_CURRENCIES = ['XAF','EUR','USD','GHS']

// Show 'FCFA' instead of 'XAF' everywhere in UI
export function displayCur(code) {
  return code === 'XAF' ? 'FCFA' : code
}

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
  NGN:1580, MAD:10.1, CAD:1.36, CHF:0.9, JPY:149,
  XOF:603, AED:3.67, AUD:1.53, BRL:5.0, CNY:7.24,
  COP:3900, DKK:6.88, ETB:56, IDR:15700, INR:83,
  KES:130, MXN:17.2, NOK:10.5, PKR:278, RWF:1280,
  SAR:3.75, SEK:10.4, SGD:1.34, TND:3.1, TZS:2520,
  UGX:3750, ZAR:18.5,
}

export function getLocale() {
  try { return localStorage.getItem('winance_locale') || 'fr-FR' } catch { return 'fr-FR' }
}

export function fmt(n, cur, dec = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  const locale = getLocale()
  try {
    let s = new Intl.NumberFormat(locale, {
      style: 'currency', currency: cur === 'XAF' ? 'XAF' : cur,
      minimumFractionDigits: dec, maximumFractionDigits: dec
    }).format(n)
    // fr-FR uses thin space (U+202F) or regular space as thousands separator → replace with '.'
    if (locale === 'fr-FR') s = s.replace(/[\u202F\u00A0 ]/g, (m, i, str) => {
      // Only replace spaces that are thousands separators (between digits)
      const before = str[i - 1], after = str[i + 1]
      if (before >= '0' && before <= '9' && after >= '0' && after <= '9') return '.'
      return m
    })
    return s
  } catch { return `${n.toFixed(dec)} ${displayCur(cur)}` }
}

export function fmtShort(n, cur) {
  if (!n && n !== 0) return '—'
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B ${displayCur(cur)}`
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M ${displayCur(cur)}`
  return fmt(n, cur)
}

export const isXAF = c => ['XAF','GHS','NGN','XOF','KES','UGX','RWF','ETB','IDR','PKR','TZS','COP'].includes(c)

export function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('')
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour,'
  if (h < 18) return 'Bon après-midi,'
  return 'Bonsoir,'
}
