import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { supabase } from './lib/supabase'
import { fmt, fmtShort, isXAF, initials, greeting, displayCur, getLocale, ALL_CURRENCIES, PIVOT_CURRENCIES, CURRENCIES, PALETTE, FALLBACK_RATES } from './lib/utils'
import AuthPage from './pages/AuthPage'

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = 'currentColor', style: sx = {}, filled = false }) => {
  const s = { width: size, height: size, display: 'block', flexShrink: 0, ...sx }
  const p = {
    home:      <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M9 21V12h6v9" stroke={color} strokeWidth="1.5" fill="none"/></>,
    chart:     <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>,
    help:      <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    settings:  <><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    plus:      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>,
    edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth="1.5" fill="none"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.5" fill="none"/></>,
    trash:     <><polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.5" fill="none"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" stroke={color} strokeWidth="1.5" fill="none"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke={color} strokeWidth="1.5" fill="none"/></>,
    x:         <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>,
    upload:    <><polyline points="16 16 12 12 8 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/><line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke={color} strokeWidth="1.5" fill="none"/></>,
    wallet:    <><rect x="1" y="6" width="22" height="15" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M1 10h22" stroke={color} strokeWidth="1.5"/><circle cx="17" cy="15" r="1" fill={color}/></>,
    logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    user:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none"/></>,
    tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="1.5" fill="none"/><line x1="7" y1="7" x2="7.01" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    database:  <><ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} strokeWidth="1.5" fill="none"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke={color} strokeWidth="1.5" fill="none"/></>,
    info:      <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.5" fill="none"/>,
    file:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="1.5" fill="none"/></>,
    grip:      <><circle cx="9" cy="6" r="1" fill={color}/><circle cx="15" cy="6" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="9" cy="18" r="1" fill={color}/><circle cx="15" cy="18" r="1" fill={color}/></>,
    chevron_r: <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>,
    check:     <polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>,
    warning:   <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    mail:      <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="1.5" fill="none"/><polyline points="22,6 12,13 2,6" stroke={color} strokeWidth="1.5" fill="none"/></>,
  }
  // Filled variants for nav icons
  const pf = {
    home:     <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color}/>,
    chart:    <><rect x="4" y="10" width="4" height="10" rx="1" fill={color}/><rect x="10" y="5" width="4" height="15" rx="1" fill={color}/><rect x="16" y="13" width="4" height="7" rx="1" fill={color}/></>,
    help:     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill={color}/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill={color}/>,
  }
  return <svg viewBox="0 0 24 24" style={s}>{(filled && pf[name]) ? pf[name] : (p[name] || p.tag)}</svg>
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overscroll-behavior:none;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#6C63FF44;border-radius:2px;}
  body{background:#0d0221;overscroll-behavior:none;}
  .app{height:100vh;max-height:100vh;background:linear-gradient(160deg,#1a0533 0%,#0d0221 60%,#120830 100%);color:#fff;font-family:'Inter',sans-serif;display:flex;flex-direction:column;overflow:hidden;}
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:20px;}
  .inp{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:12px;padding:12px 16px;font-family:inherit;font-size:16px;width:100%;max-width:100%;outline:none;transition:border .2s;-webkit-appearance:none;appearance:none;}
  .inp:focus{border-color:#6C63FF;background:rgba(108,99,255,0.08);}
  .inp::placeholder{color:#ffffff33;}
  .inp.err{border-color:#F43F5E !important;}
  select.inp{cursor:pointer;}select.inp option{background:#1a0533;color:#fff;}
  .btn-p{cursor:pointer;background:linear-gradient(135deg,#6C63FF,#4A42CC);color:#fff;border:none;border-radius:14px;padding:14px;font-size:15px;font-weight:700;font-family:inherit;box-shadow:0 8px 24px #6C63FF40;transition:all .2s;width:100%;}
  .btn-p:hover{transform:translateY(-1px);} .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .btn-g{cursor:pointer;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px 16px;font-size:14px;font-weight:600;font-family:inherit;transition:all .2s;}
  .btn-g:hover{background:rgba(255,255,255,0.1);}
  .btn-d{cursor:pointer;background:rgba(244,63,94,0.1);color:#FB7185;border:1px solid rgba(244,63,94,0.25);border-radius:12px;padding:10px 16px;font-size:14px;font-weight:600;font-family:inherit;}
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
  .sheet{background:linear-gradient(180deg,#1e0840 0%,#130528 100%);border:1px solid rgba(108,99,255,0.2);border-radius:28px 28px 0 0;padding:28px 24px 40px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;overflow-x:hidden;}
  .handle{width:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin:0 auto 24px;}
  .fade-up{animation:fadeUp .35s ease;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .slide-in{animation:slideIn .3s ease;}
  @keyframes slideIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  .bnav{position:fixed;bottom:0;left:0;right:0;background:rgba(13,2,33,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(108,99,255,0.15);padding:10px 4px 20px;display:flex;justify-content:space-around;align-items:flex-end;z-index:100;}
  .ni{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;color:#ffffff33;font-size:10px;font-weight:600;letter-spacing:.02em;transition:color .2s;border:none;background:transparent;font-family:inherit;padding:2px 10px;}
  .ni.on{color:#A89CFF;}
  .lbl{font-size:11px;color:#ffffff55;letter-spacing:.04em;margin-bottom:8px;display:block;font-weight:600;}
  .srow{display:flex;align-items:center;gap:14px;padding:16px 0;cursor:pointer;transition:opacity .15s;border:none;background:transparent;width:100%;text-align:left;font-family:inherit;}
  .srow:hover{opacity:.7;}
  .shimmer{background:linear-gradient(90deg,#2a1050 25%,#3a1870 50%,#2a1050 75%);background-size:200% 100%;animation:shim 1.5s infinite;border-radius:8px;}
  @keyframes shim{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .drag-item{cursor:grab;} .drag-item:active{cursor:grabbing;}
  .drag-lift{transform:scale(1.02);box-shadow:0 10px 32px rgba(0,0,0,0.55);background:rgba(108,99,255,0.13);border-radius:14px;z-index:10;position:relative;transition:none !important;}
  .err-msg{font-size:12px;color:#FB7185;margin-top:5px;}
  .cur-sel{background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.35);color:#A89CFF;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;-webkit-appearance:none;appearance:none;outline:none;}
`

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function AccountAvatar({ account, size = 44, fontSize = 15 }) {
  const st = { width: size, height: size, borderRadius: size * 0.27, background: `${account.color}22`, border: `1px solid ${account.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }
  if (account.svg_data) return <div style={st}><img src={account.svg_data} alt={account.name} style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain' }} /></div>
  return <div style={st}><span style={{ fontSize, fontWeight: 800, color: account.color, letterSpacing: '-0.5px', fontFamily: "'Inter',sans-serif" }}>{initials(account.name)}</span></div>
}

// ─── CAROUSEL ─────────────────────────────────────────────────────────────────
function CardCarousel({ activeIdx, onSwipe, children }) {
  const trackRef = useRef(null)
  const startX = useRef(null)
  const drag = useRef(false)
  const onPD = e => { startX.current = e.clientX; drag.current = true }
  const onPM = e => { if (!drag.current) return; const dx = e.clientX - startX.current; if (trackRef.current) trackRef.current.style.transform = `translateX(calc(-${activeIdx * 100}% + ${dx}px))` }
  const onPU = e => { if (!drag.current) return; drag.current = false; const dx = e.clientX - startX.current; if (trackRef.current) trackRef.current.style.transform = ''; if (Math.abs(dx) > 50) dx < 0 ? onSwipe('next') : onSwipe('prev'); startX.current = null }
  return (
    <div onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU} style={{ overflow: 'hidden', touchAction: 'pan-y', userSelect: 'none' }}>
      <div ref={trackRef} style={{ display: 'flex', transition: 'transform .35s cubic-bezier(.25,.46,.45,.94)', transform: `translateX(-${activeIdx * 100}%)` }}>{children}</div>
    </div>
  )
}

// ─── BANK CARD ────────────────────────────────────────────────────────────────
function BankCard({ account, balance, pivot, toPivot }) {
  const col = account.color || '#6C63FF'
  const pivotBal = account.currency ? toPivot(balance, account.currency) : null
  return (
    <div style={{ flexShrink: 0, width: '100%' }}>
      <div style={{ background: `linear-gradient(135deg,${col}dd,${col}77)`, borderRadius: 20, padding: '24px 24px 20px', position: 'relative', overflow: 'hidden', boxShadow: `0 16px 40px ${col}40`, margin: '0 2px' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -10, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Solde</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: '-1px', lineHeight: 1 }}>
              {account.currency ? fmt(balance, account.currency, isXAF(account.currency) ? 0 : 2) : '—'}
            </div>
            {pivotBal !== null && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 5 }}>≈ {fmtShort(pivotBal, pivot)}</div>}
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {account.svg_data ? <img src={account.svg_data} style={{ width: 32, height: 32, objectFit: 'contain' }} alt="" /> : <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{initials(account.name)}</span>}
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>{account.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{account.currency || 'Devise non configurée'}</div>
      </div>
    </div>
  )
}

// ─── DRAG & DROP LIST ─────────────────────────────────────────────────────────
function DragList({ items, onReorder, renderItem }) {
  const [list, setList] = useState(items)
  const [liftIdx, setLiftIdx] = useState(null)
  const latestList = useRef(items)
  const dragIdx = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => { setList(items); latestList.current = items }, [items])

  function startDrag(e, i) {
    e.preventDefault()
    dragIdx.current = i
    setLiftIdx(i)

    function onMove(ev) {
      if (dragIdx.current === null) return
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY
      const children = containerRef.current ? [...containerRef.current.children] : []
      const targetIdx = children.findIndex(child => {
        const r = child.getBoundingClientRect()
        return y >= r.top && y <= r.bottom
      })
      if (targetIdx === -1 || targetIdx === dragIdx.current) return
      const next = [...latestList.current]
      const [m] = next.splice(dragIdx.current, 1)
      next.splice(targetIdx, 0, m)
      latestList.current = next
      setList([...next])
      dragIdx.current = targetIdx
      setLiftIdx(targetIdx)
    }

    function onEnd() {
      onReorder(latestList.current)
      dragIdx.current = null
      setLiftIdx(null)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchend', onEnd)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)
  }

  return (
    <div ref={containerRef} style={{ display: 'grid' }}>
      {list.map((item, i) => (
        <div key={item.id} className={i === liftIdx ? 'drag-lift' : ''} style={{ transition: 'transform .15s, box-shadow .15s' }}>
          {renderItem(item, e => startDrag(e, i))}
        </div>
      ))}
    </div>
  )
}

// ─── ACCOUNT MODAL ────────────────────────────────────────────────────────────
function AccountModal({ initial, onClose, onBack, onSave, onDelete }) {
  const [name, setName] = useState(initial?.name || '')
  const [currency, setCurrency] = useState(initial?.currency || 'XAF')
  const [color, setColor] = useState(initial?.color || PALETTE[0])
  const [svgData, setSvgData] = useState(initial?.svg_data || null)
  const [initBal, setInitBal] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const isEdit = !!initial
  const dirty = isEdit && (name !== initial.name || currency !== initial.currency || color !== initial.color || svgData !== initial.svg_data)
  function handleFile(e) { const f = e.target.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = ev => setSvgData(ev.target.result); fr.readAsDataURL(f) }
  async function save() { if (!name.trim()) return; setLoading(true); await onSave({ id: initial?.id, name: name.trim(), currency, color, svg_data: svgData }, isEdit ? null : parseFloat(initBal) || 0); setLoading(false) }
  const handleClose = onBack || onClose
  return (
    <div className="modal-bg" onClick={handleClose}>
      <div className="sheet slide-in" onClick={e => e.stopPropagation()}>
        <div className="handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onBack && <button onClick={onBack} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 20, fontWeight: 700, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>‹</button>}
            <div style={{ fontSize: 18, fontWeight: 800 }}>{isEdit ? 'Modifier le compte' : 'Nouveau compte'}</div>
          </div>
          <button className="btn-g" style={{ padding: '6px 10px', borderRadius: 10, display: 'flex' }} onClick={onClose}><Icon name="x" size={16} color="#fff" /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: `${color}22`, border: `2px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {svgData ? <img src={svgData} style={{ width: 34, height: 34, objectFit: 'contain' }} alt="" /> : <span style={{ fontSize: 17, fontWeight: 800, color }}>{initials(name) || '?'}</span>}
          </div>
          <div><div style={{ fontSize: 15, fontWeight: 700 }}>{name || 'Nom du compte'}</div><div style={{ fontSize: 12, color: '#ffffff55', marginTop: 2 }}>{displayCur(currency)}</div></div>
        </div>
        <div style={{ marginBottom: 16 }}><label className="lbl">Nom du compte</label><input className="inp" placeholder="ex. Airtel Money, Wave..." value={name} onChange={e => setName(e.target.value)} autoFocus /></div>
        <div style={{ marginBottom: 16 }}><label className="lbl">Devise</label><select className="inp" value={currency} onChange={e => setCurrency(e.target.value)}>{ALL_CURRENCIES.map(c => <option key={c} value={c}>{displayCur(c)}</option>)}</select></div>
        <div style={{ marginBottom: 16 }}>
          <label className="lbl">Couleur</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PALETTE.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 8, cursor: 'pointer', border: color === c ? '2px solid #fff' : '2px solid transparent', background: c }} />)}
            <label style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px dashed #ffffff44', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: 16, color: '#ffffff66' }}>+</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }} />
            </label>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="lbl">Logo (SVG / PNG optionnel)</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => fileRef.current?.click()} className="btn-g" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><Icon name="upload" size={14} color="#fff" />Choisir un fichier</button>
            {svgData && <><button onClick={() => setSvgData(null)} className="btn-d" style={{ padding: '8px 10px', borderRadius: 10, display: 'flex' }}><Icon name="x" size={14} color="#FB7185" /></button><span style={{ fontSize: 11, color: '#10B981' }}>Logo chargé</span></>}
          </div>
          <input ref={fileRef} type="file" accept="image/svg+xml,image/png,image/jpeg" style={{ display: 'none' }} onChange={handleFile} />
        </div>
        {!isEdit && <div style={{ marginBottom: 24 }}><label className="lbl">Solde initial ({displayCur(currency)})</label><input className="inp" type="number" placeholder="0.00" value={initBal} onChange={e => setInitBal(e.target.value)} /></div>}
        <div style={{ display: 'flex', gap: 10 }}>
          {isEdit && onDelete && <button onClick={() => onDelete(initial.id)} className="btn-d" style={{ padding: '14px 16px', borderRadius: 14, display: 'flex', alignItems: 'center' }}><Icon name="trash" size={15} color="#FB7185" /></button>}
          <button onClick={save} disabled={loading} className="btn-p" style={dirty ? { boxShadow: '0 8px 32px #6C63FF66, 0 0 0 2px #A89CFF55' } : {}}>{loading ? 'Sauvegarde...' : isEdit ? 'Enregistrer' : 'Créer le compte'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── CATEGORY MODAL ───────────────────────────────────────────────────────────
function CategoryModal({ initial, onClose, onBack, onSave, onDelete }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || PALETTE[0])
  const isEdit = !!initial
  const dirty = isEdit && (name !== initial.name || color !== initial.color)
  const handleClose = onBack || onClose
  async function save() { if (!name.trim()) return; await onSave({ id: initial?.id, name: name.trim(), color }) }
  return (
    <div className="modal-bg" onClick={handleClose}>
      <div className="sheet slide-in" onClick={e => e.stopPropagation()}>
        <div className="handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onBack && <button onClick={onBack} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 20, fontWeight: 700, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>‹</button>}
            <div style={{ fontSize: 18, fontWeight: 800 }}>{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</div>
          </div>
          <button className="btn-g" style={{ padding: '6px 10px', borderRadius: 10, display: 'flex' }} onClick={onClose}><Icon name="x" size={16} color="#fff" /></button>
        </div>
        <div style={{ marginBottom: 16 }}><label className="lbl">Nom</label><input className="inp" placeholder="ex. Électricité, Abonnements..." value={name} onChange={e => setName(e.target.value)} autoFocus /></div>
        <div style={{ marginBottom: 24 }}>
          <label className="lbl">Couleur</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PALETTE.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 8, cursor: 'pointer', border: color === c ? '2px solid #fff' : '2px solid transparent', background: c }} />)}
            <label style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px dashed #ffffff44', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: 16, color: '#ffffff66' }}>+</span>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }} />
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isEdit && onDelete && <button onClick={() => onDelete(initial.id)} className="btn-d" style={{ padding: '14px 16px', borderRadius: 14, display: 'flex', alignItems: 'center' }}><Icon name="trash" size={15} color="#FB7185" /></button>}
          <button onClick={save} className="btn-p" style={dirty ? { boxShadow: '0 8px 32px #6C63FF66, 0 0 0 2px #A89CFF55' } : {}}>{isEdit ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── ADD TX MODAL ─────────────────────────────────────────────────────────────
function AddModal({ accounts, categories, onClose, onSave, rates, pivot }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ accountId: accounts[0]?.id || '', toAccountId: accounts[1]?.id || accounts[0]?.id || '', amount: '', currency: accounts[0]?.currency || 'XAF', type: 'expense', categoryId: '', note: '', date: today })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const isTransfer = form.type === 'transfer'
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: false })) }

  function validate() {
    const e = {}
    if (!form.amount || isNaN(parseFloat(form.amount))) e.amount = 'Montant requis'
    if (!isTransfer && !form.note.trim()) e.note = 'La note est obligatoire'
    if (isTransfer && form.accountId === form.toAccountId) e.toAccountId = 'Comptes différents requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function save() {
    if (!validate()) return
    setLoading(true)
    const amt = Math.abs(parseFloat(form.amount))
    if (isTransfer) {
      const fromAcc = accounts.find(a => a.id === form.accountId)
      const toAcc = accounts.find(a => a.id === form.toAccountId)
      // Convert amount from form.currency to each account's currency
      const toUSD = (n, cur) => (rates[cur] ? n / rates[cur] : n)
      const fromPivot = (n, cur) => toUSD(n, form.currency) * (rates[cur] || 1)
      const fromAmt = fromAcc?.currency ? fromPivot(amt, fromAcc.currency) : amt
      const toAmt = toAcc?.currency ? fromPivot(amt, toAcc.currency) : amt
      await onSave([
        { account_id: form.accountId, amount: -fromAmt, currency: fromAcc?.currency || form.currency, type: 'transfer', category_name: 'Transfert', category_color: '#A855F7', note: `→ ${toAcc?.name || '?'}`, date: form.date },
        { account_id: form.toAccountId, amount: toAmt, currency: toAcc?.currency || form.currency, type: 'transfer', category_name: 'Transfert', category_color: '#A855F7', note: `← ${fromAcc?.name || '?'}`, date: form.date },
      ])
    } else {
      const sign = form.type === 'expense' ? -1 : 1
      const cat = categories.find(c => c.id === form.categoryId)
      await onSave({ account_id: form.accountId, amount: sign * amt, currency: form.currency, type: form.type, category_id: form.categoryId || null, category_name: cat?.name || '', category_color: cat?.color || '#6C63FF', note: form.note.trim(), date: form.date })
    }
    setLoading(false)
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="sheet slide-in" onClick={e => e.stopPropagation()}>
        <div className="handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Nouvelle transaction</div>
          <button className="btn-g" style={{ padding: '6px 10px', borderRadius: 10, display: 'flex' }} onClick={onClose}><Icon name="x" size={16} color="#fff" /></button>
        </div>

        {/* Type */}
        <div style={{ marginBottom: 18 }}>
          <label className="lbl">Type</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['expense', 'Dépense'], ['income', 'Revenu'], ['transfer', 'Transfert']].map(([v, l]) => (
              <button key={v} onClick={() => set('type', v)} style={{ flex: 1, cursor: 'pointer', padding: '12px 6px', borderRadius: 12, border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: form.type === v ? 'rgba(108,99,255,0.35)' : 'transparent', color: form.type === v ? '#A89CFF' : '#ffffff55' }}>{l}</button>
            ))}
          </div>
        </div>

        {isTransfer ? (
          <>
            {/* Transfer: from → to */}
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Compte source</label>
              <select className="inp" value={form.accountId} onChange={e => { const a = accounts.find(x => x.id === e.target.value); set('accountId', e.target.value); if (a?.currency) set('currency', a.currency) }}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({displayCur(a.currency)})</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Montant transféré</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className={`inp${errors.amount ? ' err' : ''}`} type="number" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} style={{ flex: 1, minWidth: 0 }} />
                <select className="inp" value={form.currency} onChange={e => set('currency', e.target.value)} style={{ width: 100, flexShrink: 0 }}>{ALL_CURRENCIES.map(c => <option key={c} value={c}>{displayCur(c)}</option>)}</select>
              </div>
              {errors.amount && <div className="err-msg">{errors.amount}</div>}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Compte destinataire</label>
              <select className="inp" value={form.toAccountId} onChange={e => set('toAccountId', e.target.value)}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({displayCur(a.currency)})</option>)}
              </select>
              {errors.toAccountId && <div className="err-msg">{errors.toAccountId}</div>}
            </div>
          </>
        ) : (
          <>
            {/* Compte */}
            <div style={{ marginBottom: 18 }}><label className="lbl">Compte</label>
              <select className="inp" value={form.accountId} onChange={e => { const a = accounts.find(x => x.id === e.target.value); set('accountId', e.target.value); if (a?.currency) set('currency', a.currency) }}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({displayCur(a.currency)})</option>)}
              </select>
            </div>
            {/* Montant */}
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Montant</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className={`inp${errors.amount ? ' err' : ''}`} type="number" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} style={{ flex: 1, minWidth: 0 }} />
                <select className="inp" value={form.currency} onChange={e => set('currency', e.target.value)} style={{ width: 100, flexShrink: 0 }}>{ALL_CURRENCIES.map(c => <option key={c} value={c}>{displayCur(c)}</option>)}</select>
              </div>
              {errors.amount && <div className="err-msg">{errors.amount}</div>}
              <div style={{ fontSize: 12, color: '#ffffff33', marginTop: 6 }}>Saisie dans n'importe quelle devise — conversion automatique.</div>
            </div>
            {/* Catégorie */}
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Catégorie</label>
              {categories.length === 0
                ? <div style={{ fontSize: 13, color: '#ffffff44', padding: '12px 0' }}>Aucune catégorie. Crées-en une dans les Paramètres.</div>
                : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => set('categoryId', c.id)} style={{ cursor: 'pointer', padding: '8px 14px', borderRadius: 20, border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, transition: 'all .15s', background: form.categoryId === c.id ? 'rgba(108,99,255,0.35)' : 'transparent', color: form.categoryId === c.id ? '#A89CFF' : '#ffffff55' }}>{c.name}</button>
                  ))}
                </div>}
            </div>
            {/* Note */}
            <div style={{ marginBottom: 18 }}>
              <label className="lbl">Note <span style={{ color: '#F43F5E' }}>*</span></label>
              <input className={`inp${errors.note ? ' err' : ''}`} placeholder="ex. Courses au marché, Facture électricité..." value={form.note} onChange={e => set('note', e.target.value)} />
              {errors.note && <div className="err-msg">{errors.note}</div>}
            </div>
          </>
        )}

        {/* Date */}
        <div style={{ marginBottom: 28 }}>
          <label className="lbl">Date</label>
          <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <input className="inp" type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ width: '100%', maxWidth: '100%', display: 'block' }} />
          </div>
        </div>

        <button onClick={save} disabled={loading} className="btn-p">{loading ? 'Sauvegarde...' : 'Enregistrer'}</button>
      </div>
    </div>
  )
}

// ─── TX ROW ───────────────────────────────────────────────────────────────────
function TxRow({ tx, accounts, pivot, toPivot, onDelete, swipeable }) {
  const acc = accounts.find(a => a.id === tx.account_id)
  const amt = Number(tx.amount)
  const pivotAmt = toPivot(amt, tx.currency)
  const col = tx.category_color || '#6C63FF'
  const [offsetX, setOffsetX] = useState(0)
  const startX = useRef(null)
  const elRef = useRef(null)
  const canSwipe = swipeable && !!onDelete

  useEffect(() => {
    if (!canSwipe) return
    const el = elRef.current
    if (!el) return
    let sx = null
    let moving = false
    function onTS(e) { sx = e.touches[0].clientX; moving = false }
    function onTM(e) {
      if (sx === null) return
      const dx = e.touches[0].clientX - sx
      if (!moving && Math.abs(dx) < 6) return
      moving = true
      if (dx < 0) { e.preventDefault(); setOffsetX(Math.max(dx, -72)) }
    }
    function onTE() {
      if (offsetX < -48) onDelete(tx)
      else setOffsetX(0)
      sx = null
    }
    el.addEventListener('touchstart', onTS, { passive: true })
    el.addEventListener('touchmove', onTM, { passive: false })
    el.addEventListener('touchend', onTE)
    return () => { el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTM); el.removeEventListener('touchend', onTE) }
  }, [canSwipe, onDelete, tx, offsetX])

  const delProg = Math.min(1, Math.abs(offsetX) / 48)

  return (
    <div ref={elRef} style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {canSwipe && <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 72, background: `rgba(244,63,94,${delProg * 0.85})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .1s' }}>
        <Icon name="trash" size={18} color={`rgba(251,113,133,${delProg})`} />
      </div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', transform: `translateX(${offsetX}px)`, transition: startX.current ? 'none' : 'transform .3s' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${col}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: col }}>{(tx.category_name || '?').slice(0, 2).toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.note || tx.category_name}</div>
          <div style={{ fontSize: 11, color: '#ffffff33', marginTop: 2 }}>{acc?.name} · {tx.date}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: amt >= 0 ? '#A89CFF' : '#FB7185' }}>{amt >= 0 ? '+' : ''}{fmt(amt, tx.currency, isXAF(tx.currency) ? 0 : 2)}</div>
          <div style={{ fontSize: 10, color: '#ffffff33', marginTop: 1 }}>{pivotAmt !== null ? `${pivotAmt >= 0 ? '+' : ''}${Math.abs(pivotAmt).toFixed(2)} ${displayCur(pivot)}` : '—'}</div>
        </div>
      </div>
    </div>
  )
}

// ─── SPEND CHART ──────────────────────────────────────────────────────────────
function SpendChart({ transactions, categories, pivot, toPivot }) {
  const data = categories.map(cat => ({
    name: cat.name.slice(0, 6),
    total: parseFloat(transactions.filter(t => t.category_id === cat.id && t.amount < 0).reduce((s, t) => { const p = toPivot(Math.abs(Number(t.amount)), t.currency); return p !== null ? s + p : s }, 0).toFixed(2)),
    color: cat.color
  })).filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 6)
  const catTotals = categories.map(cat => ({ ...cat, total: transactions.filter(t => t.category_id === cat.id && t.amount < 0).reduce((s, t) => { const p = toPivot(Math.abs(Number(t.amount)), t.currency); return p !== null ? s + p : s }, 0) })).filter(d => d.total > 0).sort((a, b) => b.total - a.total)
  const grandTotal = catTotals.reduce((s, d) => s + d.total, 0)
  if (!data.length) return <div style={{ textAlign: 'center', padding: '40px 0', color: '#ffffff33', fontSize: 13 }}>Aucune dépense enregistrée</div>
  return (
    <>
      <div style={{ height: 160, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="name" tick={{ fill: '#ffffff44', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>{data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff55', marginBottom: 12, letterSpacing: '.04em' }}>Répartition</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {catTotals.slice(0, 4).map(d => (
          <div key={d.id} style={{ flex: '1 1 80px', background: `${d.color}18`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: d.color }}>{grandTotal > 0 ? Math.round((d.total / grandTotal) * 100) : 0}%</div>
            <div style={{ fontSize: 10, color: '#ffffff55', marginTop: 4 }}>{d.name}</div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─── FAVORITES MODAL ──────────────────────────────────────────────────────────
function FavoritesModal({ onDone }) {
  const [sel, setSel] = useState(['XAF','EUR','USD','GHS'])
  const toggle = c => setSel(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c])
  return (
    <div className="modal-bg" style={{ alignItems: 'center' }}>
      <div className="sheet slide-in" style={{ borderRadius: 24, maxHeight: '85vh' }}>
        <div className="handle" />
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Tes devises</div>
        <div style={{ fontSize: 13, color: '#ffffff55', marginBottom: 24, textAlign: 'center' }}>Sélectionne les devises que tu utilises au quotidien</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {ALL_CURRENCIES.map(c => (
            <button key={c} onClick={() => toggle(c)} style={{ cursor: 'pointer', padding: '8px 16px', borderRadius: 20, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, transition: 'all .15s', background: sel.includes(c) ? 'rgba(108,99,255,0.35)' : 'rgba(255,255,255,0.06)', color: sel.includes(c) ? '#A89CFF' : '#ffffff77' }}>
              {displayCur(c)}
            </button>
          ))}
        </div>
        <button onClick={() => sel.length > 0 && onDone(sel)} disabled={sel.length === 0} className="btn-p">
          Continuer
        </button>
      </div>
    </div>
  )
}

// ─── PAGE : AIDE ──────────────────────────────────────────────────────────────
function AidePage() {
  const faqs = [
    { q: 'Comment ajouter un compte ?', r: 'Depuis les Paramètres → Comptes → bouton Ajouter. Tu peux choisir un nom, une devise, une couleur et uploader un logo.' },
    { q: 'Comment changer la devise d\'affichage ?', r: 'En haut de l\'écran Accueil, appuie sur USD, EUR, XAF ou GHS pour basculer instantanément.' },
    { q: 'Mes données sont-elles sécurisées ?', r: 'Oui. Tes données sont stockées sur Supabase (infrastructure sécurisée) et liées à ton compte Google. Personne d\'autre ne peut les voir.' },
    { q: 'Comment réordonner mes comptes ?', r: 'Dans Paramètres → Comptes, maintiens et glisse chaque compte pour le déplacer.' },
    { q: 'Puis-je saisir un montant dans une autre devise ?', r: 'Oui. Lors de l\'ajout d\'une transaction, tu peux choisir n\'importe quelle devise. Winance convertit automatiquement selon les taux de référence.' },
    { q: 'La note est-elle vraiment obligatoire ?', r: 'Oui — pour que tu saches toujours à quoi correspond chaque transaction quand tu consultes ton historique.' },
  ]
  return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Aide</div>
      <div style={{ fontSize: 13, color: '#ffffff44', marginBottom: 24 }}>Questions fréquentes</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {faqs.map((f, i) => <FaqItem key={i} q={f.q} r={f.r} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: 'rgba(108,99,255,0.35)', color: '#A89CFF' }}>
          <Icon name="mail" size={15} color="#A89CFF" />Contacter le support
        </button>
      </div>
    </div>
  )
}
function FaqItem({ q, r }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontFamily: 'inherit', color: '#fff', fontSize: 13, fontWeight: 600, textAlign: 'left' }}>
        {q}
        <Icon name="chevron_r" size={16} color="#ffffff44" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
      </button>
      {open && <div style={{ paddingBottom: 14, fontSize: 13, color: '#ffffff88', lineHeight: 1.6 }}>{r}</div>}
    </div>
  )
}

// ─── PAGE : PARAMÈTRES ────────────────────────────────────────────────────────
function SettingsPage({ session, profile, accounts, categories, section, onSection, locale, onLocale, onSaveAccount, onDeleteAccount, onReorderAccounts, onSaveCategory, onDeleteCategory, onReorderCategories, onLogout }) {
  const [editAcct, setEditAcct] = useState(null)
  const [showNewAcct, setShowNewAcct] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [showNewCat, setShowNewCat] = useState(false)
  const [selectedAccts, setSelectedAccts] = useState([])
  const [selectedCats, setSelectedCats] = useState([])
  const [editModeAccts, setEditModeAccts] = useState(false)
  const [editModeCats, setEditModeCats] = useState(false)

  function back() { onSection(null); setSelectedAccts([]); setSelectedCats([]); setEditModeAccts(false); setEditModeCats(false) }

  function PageTitle({ label }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={back} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 20, fontWeight: 700, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>‹</button>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{label}</div>
      </div>
    )
  }

  if (section === 'comptes') {
    const toggleSel = id => setSelectedAccts(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
    async function deleteSelected() {
      if (!window.confirm(`Supprimer ${selectedAccts.length} compte(s) ?`)) return
      for (const id of selectedAccts) await onDeleteAccount(id, true)
      setSelectedAccts([])
    }
    return (
      <div className="fade-up" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={back} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 20, fontWeight: 700, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>‹</button>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Gérer les comptes</div>
          </div>
          {!editModeAccts
            ? <button onClick={() => setEditModeAccts(true)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Modifier</button>
            : <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {selectedAccts.length > 0
                  ? <button onClick={deleteSelected} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#FB7185', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Supprimer ({selectedAccts.length})</button>
                  : <button onClick={() => setShowNewAcct(true)} className="btn-g" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><Icon name="plus" size={14} color="#fff" />Ajouter</button>}
                <button onClick={() => { setEditModeAccts(false); setSelectedAccts([]) }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ffffff55', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Terminer</button>
              </div>}
        </div>
        {editModeAccts && <div style={{ fontSize: 12, color: '#ffffff44', marginBottom: 16 }}>Maintiens pour réordonner · tap pour sélectionner</div>}
        {editModeAccts
          ? <DragList items={accounts} onReorder={onReorderAccounts} renderItem={(acc, dragHandle) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', background: selectedAccts.includes(acc.id) ? 'rgba(108,99,255,0.08)' : 'transparent', transition: 'background .15s' }}>
                <div onMouseDown={dragHandle} onTouchStart={dragHandle} style={{ cursor: 'grab', padding: '4px 2px', touchAction: 'none', flexShrink: 0 }}><Icon name="grip" size={16} color="#ffffff33" /></div>
                <button onClick={() => toggleSel(acc.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${selectedAccts.includes(acc.id) ? '#A89CFF' : 'rgba(255,255,255,0.2)'}`, background: selectedAccts.includes(acc.id) ? 'rgba(108,99,255,0.35)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                    {selectedAccts.includes(acc.id) && <Icon name="check" size={10} color="#A89CFF" />}
                  </div>
                  <AccountAvatar account={acc} size={36} fontSize={12} />
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{acc.name}</div><div style={{ fontSize: 11, color: '#ffffff44' }}>{displayCur(acc.currency)}</div></div>
                </button>
                <button onClick={() => setEditAcct(acc)} style={{ cursor: 'pointer', background: 'none', border: 'none', display: 'flex', padding: 4, flexShrink: 0 }}><Icon name="edit" size={15} color="#ffffff44" /></button>
              </div>
            )} />
          : <div>
              {accounts.map((acc, i) => (
                <button key={acc.id} onClick={() => setEditAcct(acc)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', width: '100%', background: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  <AccountAvatar account={acc} size={38} fontSize={13} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{acc.name}</div><div style={{ fontSize: 11, color: '#ffffff44', marginTop: 2 }}>{displayCur(acc.currency)}</div></div>
                  <Icon name="chevron_r" size={16} color="#ffffff33" />
                </button>
              ))}
              {accounts.length === 0 && <div style={{ fontSize: 13, color: '#ffffff44', padding: '20px 0', textAlign: 'center' }}>Aucun compte</div>}
              <button onClick={() => setShowNewAcct(true)} className="btn-g" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 16 }}><Icon name="plus" size={14} color="#fff" />Ajouter un compte</button>
            </div>}
        {(showNewAcct || editAcct) && <AccountModal initial={editAcct} onBack={editAcct ? () => setEditAcct(null) : () => setShowNewAcct(false)} onClose={() => { setShowNewAcct(false); setEditAcct(null) }} onSave={async (a, b) => { await onSaveAccount(a, b); setShowNewAcct(false); setEditAcct(null) }} onDelete={editAcct ? async id => { await onDeleteAccount(id); setEditAcct(null) } : null} />}
      </div>
    )
  }

  if (section === 'categories') {
    const toggleSel = id => setSelectedCats(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
    async function deleteSelected() {
      if (!window.confirm(`Supprimer ${selectedCats.length} catégorie(s) ?`)) return
      for (const id of selectedCats) await onDeleteCategory(id, true)
      setSelectedCats([])
    }
    return (
      <div className="fade-up" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={back} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 20, fontWeight: 700, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>‹</button>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Gérer les catégories</div>
          </div>
          {!editModeCats
            ? <button onClick={() => setEditModeCats(true)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#A89CFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Modifier</button>
            : <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {selectedCats.length > 0
                  ? <button onClick={deleteSelected} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#FB7185', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Supprimer ({selectedCats.length})</button>
                  : <button onClick={() => setShowNewCat(true)} className="btn-g" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><Icon name="plus" size={14} color="#fff" />Ajouter</button>}
                <button onClick={() => { setEditModeCats(false); setSelectedCats([]) }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ffffff55', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Terminer</button>
              </div>}
        </div>
        {editModeCats && <div style={{ fontSize: 12, color: '#ffffff44', marginBottom: 16 }}>Maintiens pour réordonner · tap pour sélectionner</div>}
        {editModeCats
          ? <DragList items={categories} onReorder={onReorderCategories} renderItem={(cat, dragHandle) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', background: selectedCats.includes(cat.id) ? 'rgba(108,99,255,0.08)' : 'transparent', transition: 'background .15s' }}>
                <div onMouseDown={dragHandle} onTouchStart={dragHandle} style={{ cursor: 'grab', padding: '4px 2px', touchAction: 'none', flexShrink: 0 }}><Icon name="grip" size={16} color="#ffffff33" /></div>
                <button onClick={() => toggleSel(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${selectedCats.includes(cat.id) ? '#A89CFF' : 'rgba(255,255,255,0.2)'}`, background: selectedCats.includes(cat.id) ? 'rgba(108,99,255,0.35)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                    {selectedCats.includes(cat.id) && <Icon name="check" size={10} color="#A89CFF" />}
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{cat.name}</div>
                </button>
                <button onClick={() => setEditCat(cat)} style={{ cursor: 'pointer', background: 'none', border: 'none', display: 'flex', padding: 4, flexShrink: 0 }}><Icon name="edit" size={15} color="#ffffff44" /></button>
              </div>
            )} />
          : <div>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setEditCat(cat)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', width: '100%', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#fff' }}>{cat.name}</div>
                  <Icon name="chevron_r" size={16} color="#ffffff33" />
                </button>
              ))}
              {categories.length === 0 && <div style={{ fontSize: 13, color: '#ffffff44', padding: '20px 0', textAlign: 'center' }}>Aucune catégorie</div>}
              <button onClick={() => setShowNewCat(true)} className="btn-g" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 16 }}><Icon name="plus" size={14} color="#fff" />Ajouter une catégorie</button>
            </div>}
        {(showNewCat || editCat) && <CategoryModal initial={editCat} onBack={editCat ? () => setEditCat(null) : () => setShowNewCat(false)} onClose={() => { setShowNewCat(false); setEditCat(null) }} onSave={async c => { await onSaveCategory(c); setShowNewCat(false); setEditCat(null) }} onDelete={editCat ? async id => { await onDeleteCategory(id); setEditCat(null) } : null} />}
      </div>
    )
  }

  if (section === 'cgv') return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <PageTitle label="Conditions d'utilisation" />
      <div style={{ fontSize: 13, color: '#ffffff88', lineHeight: 1.8 }}>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>1. Objet</strong><br />Winance est une application gratuite de gestion financière personnelle. Aucune transaction commerciale n'est effectuée via la plateforme.</p>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>2. Accès au service</strong><br />L'accès à Winance est gratuit et nécessite un compte Google. Le service est disponible sans engagement de durée.</p>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>3. Responsabilité</strong><br />Winance est un outil de suivi personnel. Les données affichées sont saisies manuellement par l'utilisateur. Winance ne peut être tenu responsable d'erreurs de saisie ou d'interprétation financière.</p>
        <p><strong style={{ color: '#fff' }}>4. Modification</strong><br />Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés des changements majeurs.</p>
      </div>
    </div>
  )

  if (section === 'confidentialite') return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <PageTitle label="Politique de confidentialité" />
      <div style={{ fontSize: 13, color: '#ffffff88', lineHeight: 1.8 }}>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>Données collectées</strong><br />Winance collecte uniquement les données nécessaires au fonctionnement : prénom (via Google), transactions et comptes que tu saisis toi-même.</p>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>Utilisation des données</strong><br />Tes données sont utilisées exclusivement pour afficher tes informations financières. Elles ne sont jamais vendues, partagées ou utilisées à des fins publicitaires.</p>
        <p style={{ marginBottom: 12 }}><strong style={{ color: '#fff' }}>Stockage</strong><br />Les données sont stockées sur Supabase (infrastructure sécurisée, serveurs en Europe). Chaque utilisateur n'a accès qu'à ses propres données.</p>
        <p><strong style={{ color: '#fff' }}>Suppression</strong><br />Pour une suppression complète de ton compte, contacte support@winance.app.</p>
      </div>
    </div>
  )

  if (section === 'winance') return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <PageTitle label="À propos" />
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#6C63FF,#4A42CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 12px 32px #6C63FF40' }}>
          <Icon name="wallet" size={32} color="#fff" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Winance</div>
        <div style={{ fontSize: 12, color: '#ffffff44', marginBottom: 20 }}>Version 1.0.0</div>
        <div style={{ fontSize: 13, color: '#ffffff88', lineHeight: 1.7 }}>
          Application de gestion financière personnelle multi-devises, conçue pour les Africains qui gèrent plusieurs comptes mobile money, PayPal et bancaires au quotidien.<br /><br />
          Gratuite, sans publicité, sans revente de données.
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#ffffff33', textAlign: 'center' }}>Fait avec soin · support@winance.app</div>
    </div>
  )

  if (section === 'locale') return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <PageTitle label="Format des nombres" />
      <div style={{ fontSize: 13, color: '#ffffff55', marginBottom: 20 }}>Choisit comment les montants sont affichés.</div>
      {[['fr-FR', 'Français', '1 234 567,89'], ['en-US', 'English', '1,234,567.89']].map(([val, lbl, ex]) => (
        <button key={val} onClick={() => onLocale(val)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{lbl}</div>
            <div style={{ fontSize: 12, color: '#ffffff44', marginTop: 2 }}>{ex}</div>
          </div>
          {locale === val && <Icon name="check" size={16} color="#A89CFF" />}
        </button>
      ))}
    </div>
  )

  const menuItems = [
    { key: 'comptes', label: 'Gérer les comptes' },
    { key: 'categories', label: 'Gérer les catégories' },
    { key: 'locale', label: 'Format des nombres' },
    { key: 'cgv', label: "Conditions d'utilisation" },
    { key: 'confidentialite', label: 'Politique de confidentialité' },
    { key: 'winance', label: 'À propos' },
  ]

  return (
    <div className="fade-up" style={{ paddingBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Réglages</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="user" size={20} color="#ffffffaa" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{profile?.firstname || '—'}</div>
          <div style={{ fontSize: 12, color: '#ffffff44', marginTop: 2 }}>{session?.user?.email}</div>
        </div>
      </div>
      <div>
        {menuItems.map((item, i) => (
          <button key={item.key} onClick={() => onSection(item.key)} className="srow" style={{ borderBottom: i < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#fff' }}>{item.label}</div>
            <Icon name="chevron_r" size={16} color="#ffffff33" />
          </button>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
        <button onClick={onLogout} className="srow" style={{ width: '100%' }}>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#FB7185' }}>Se déconnecter</div>
        </button>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [pivot, setPivot] = useState('XAF')
  const [page, setPage] = useState(() => { const h = window.location.hash.slice(1).split('/')[0]; return h || 'home' })
  const [settingsSection, setSettingsSection] = useState(() => { const p = window.location.hash.slice(1).split('/'); return p[0] === 'settings' ? (p[1] || null) : null })
  const [activeIdx, setActiveIdx] = useState(0)
  const [filterCat, setFilterCat] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [locale, setLocale] = useState(() => { try { return localStorage.getItem('winance_locale') || 'fr-FR' } catch { return 'fr-FR' } })
  const rates = FALLBACK_RATES
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('winance_favorites') || 'null') || ['XAF','EUR','USD','GHS'] } catch { return ['XAF','EUR','USD','GHS'] }
  })
  const [showFavModal, setShowFavModal] = useState(false)

  // ── Hash routing ───────────────────────────────────────────────────────────
  function go(pg, sec = null) {
    const hash = '#' + (sec ? `${pg}/${sec}` : pg)
    if (window.location.hash !== hash) history.pushState(null, '', hash)
    setPage(pg); setSettingsSection(sec)
  }
  useEffect(() => {
    function onPop() {
      const parts = window.location.hash.slice(1).split('/')
      setPage(parts[0] || 'home')
      setSettingsSection(parts[0] === 'settings' ? (parts[1] || null) : null)
    }
    window.addEventListener('popstate', onPop)
    if (!window.location.hash) history.replaceState(null, '', '#home')
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => { setSession(s); setAuthLoading(false) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      loadData()
      if (!localStorage.getItem('winance_fav_done')) setShowFavModal(true)
    }
  }, [session])

  async function loadData() {
    setDataLoading(true)
    const uid = session.user.id
    const [{ data: prof }, { data: accts }, { data: txs }, { data: cats }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase.from('accounts').select('*').eq('user_id', uid).order('position'),
      supabase.from('transactions').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('user_id', uid).order('position'),
    ])
    setProfile(prof); setPivot(prof?.pivot_currency || 'XAF')
    setAccounts(accts || []); setTransactions(txs || [])
    setCategories(cats || [])
    setDataLoading(false)
  }

  const pivotInit = useRef(false)
  useEffect(() => {
    if (!pivotInit.current) { pivotInit.current = true; return }
    if (profile) supabase.from('profiles').update({ pivot_currency: pivot }).eq('id', session.user.id)
  }, [pivot])

  // ── Conversions ────────────────────────────────────────────────────────────
  function toUSD(n, cur) { if (!rates[cur] || n === null) return null; return n / rates[cur] }
  function toPivot(n, cur) { const u = toUSD(n, cur); if (u === null) return null; return u * (rates[pivot] || 1) }
  function getBalance(accId) {
    const acc = accounts.find(a => a.id === accId); if (!acc?.currency) return 0
    return transactions.filter(t => t.account_id === accId).reduce((sum, t) => {
      const p = toPivot(Number(t.amount), t.currency); if (p === null) return sum
      return sum + (p / (rates[pivot] || 1)) * (rates[acc.currency] || 1)
    }, 0)
  }
  function getBalancePivot(accId) { const acc = accounts.find(a => a.id === accId); if (!acc?.currency) return null; return toPivot(getBalance(accId), acc.currency) }
  const totalPivot = accounts.reduce((s, a) => { const b = getBalancePivot(a.id); return b !== null ? s + b : s }, 0)
  const filteredTx = transactions.filter(t => filterCat === 'all' || t.category_id === filterCat)

  // ── CRUD ───────────────────────────────────────────────────────────────────
  async function handleSaveAccount(acc, initBal) {
    const uid = session.user.id
    if (acc.id) {
      const { data } = await supabase.from('accounts').update({ name: acc.name, currency: acc.currency, color: acc.color, svg_data: acc.svg_data }).eq('id', acc.id).select().single()
      setAccounts(p => p.map(a => a.id === acc.id ? data : a))
    } else {
      const { data } = await supabase.from('accounts').insert({ ...acc, user_id: uid, position: accounts.length }).select().single()
      setAccounts(p => [...p, data])
      if (initBal && initBal !== 0 && data.currency) {
        const { data: tx } = await supabase.from('transactions').insert({ user_id: uid, account_id: data.id, amount: initBal, currency: data.currency, type: 'income', category_name: 'Solde initial', category_color: '#475569', note: 'Solde initial', date: new Date().toISOString().split('T')[0] }).select().single()
        if (tx) setTransactions(p => [tx, ...p])
      }
    }
  }

  async function handleDeleteAccount(id, skipConfirm = false) {
    if (!skipConfirm && !window.confirm('Supprimer ce compte ?')) return
    await supabase.from('accounts').delete().eq('id', id)
    setAccounts(p => p.filter(a => a.id !== id))
    setActiveIdx(i => Math.max(0, i - 1))
  }

  async function handleReorderAccounts(reordered) {
    setAccounts(reordered)
    await Promise.all(reordered.map((a, i) => supabase.from('accounts').update({ position: i }).eq('id', a.id)))
  }

  async function handleSaveCategory(cat) {
    const uid = session.user.id
    if (cat.id) {
      const { data } = await supabase.from('categories').update({ name: cat.name, color: cat.color }).eq('id', cat.id).select().single()
      setCategories(p => p.map(c => c.id === cat.id ? data : c))
    } else {
      const { data } = await supabase.from('categories').insert({ name: cat.name, color: cat.color, user_id: uid, position: categories.length }).select().single()
      setCategories(p => [...p, data])
    }
  }

  async function handleDeleteCategory(id, skipConfirm = false) {
    if (!skipConfirm && !window.confirm('Supprimer cette catégorie ?')) return
    await supabase.from('categories').delete().eq('id', id)
    setCategories(p => p.filter(c => c.id !== id))
  }

  async function handleReorderCategories(reordered) {
    setCategories(reordered)
    await Promise.all(reordered.map((c, i) => supabase.from('categories').update({ position: i }).eq('id', c.id)))
  }

  async function handleAddTx(txData) {
    if (Array.isArray(txData)) {
      const results = await Promise.all(txData.map(t => supabase.from('transactions').insert({ ...t, user_id: session.user.id }).select().single()))
      results.forEach(({ data }) => { if (data) setTransactions(p => [data, ...p]) })
    } else {
      const { data } = await supabase.from('transactions').insert({ ...txData, user_id: session.user.id }).select().single()
      if (data) setTransactions(p => [data, ...p])
    }
    setShowAdd(false)
  }

  async function handleDeleteTx(tx) {
    await supabase.from('transactions').delete().eq('id', tx.id)
    setTransactions(p => p.filter(t => t.id !== tx.id))
  }

  async function logout() { await supabase.auth.signOut() }

  function saveFavorites(fav) {
    setFavorites(fav)
    localStorage.setItem('winance_favorites', JSON.stringify(fav))
    localStorage.setItem('winance_fav_done', '1')
    setShowFavModal(false)
    if (!fav.includes(pivot)) setPivot(fav[0])
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1a0533 0%,#0d0221 60%,#120830 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{CSS}</style>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#6C63FF,#4A42CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px #6C63FF40' }}><Icon name="wallet" size={30} color="#fff" /></div>
    </div>
  )
  if (!session) return <><style>{CSS}</style><AuthPage /></>

  const firstname = profile?.firstname || session.user.email?.split('@')[0] || ''
  function swipe(dir) { if (dir === 'next') setActiveIdx(i => Math.min(i + 1, accounts.length - 1)); else setActiveIdx(i => Math.max(i - 1, 0)) }

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* ── HEADER — accueil uniquement ── */}
      {page === 'home' && (
        <div style={{ padding: '20px 20px 0' }}>
          {/* Row: salutation + currency dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: '#ffffff55', fontWeight: 500 }}>{greeting()}</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{firstname}</div>
            </div>
            {/* Currency select with ▾ indicator */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select className="cur-sel" value={pivot} onChange={e => setPivot(e.target.value)} style={{ paddingRight: 26 }}>
                {favorites.map(c => <option key={c} value={c} style={{ background: '#1a0533', color: '#fff' }}>{displayCur(c)}</option>)}
                <option disabled>──────</option>
                {ALL_CURRENCIES.filter(c => !favorites.includes(c)).map(c => <option key={c} value={c} style={{ background: '#1a0533', color: '#fff' }}>{displayCur(c)}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 9, pointerEvents: 'none', fontSize: 10, color: '#A89CFF', lineHeight: 1 }}>▾</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 18 }} />
          {/* Patrimoine centré — breathing room */}
          <div style={{ textAlign: 'center', paddingBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Patrimoine total</div>
            {dataLoading
              ? <div className="shimmer" style={{ width: 200, height: 44, margin: '0 auto' }} />
              : <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1 }}>{fmtShort(totalPivot, pivot)}</div>}
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: page === 'home' ? 0 : 24, paddingBottom: 90 }}>

        {/* ── ACCUEIL ── */}
        {page === 'home' && (
          <div className="fade-up">
            {accounts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 14, color: '#ffffff44', marginBottom: 16 }}>Aucun compte configuré</div>
                <button onClick={() => setShowAddAccount(true)} className="btn-p" style={{ width: 'auto', padding: '12px 24px', fontSize: 14 }}>Ajouter un compte</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <CardCarousel activeIdx={activeIdx} onSwipe={swipe}>
                    {accounts.map(acc => <BankCard key={acc.id} account={acc} balance={getBalance(acc.id)} pivot={pivot} toPivot={toPivot} />)}
                  </CardCarousel>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                  {accounts.map((_, i) => <button key={i} onClick={() => setActiveIdx(i)} style={{ cursor: 'pointer', border: 'none', borderRadius: '50%', transition: 'all .3s', width: i === activeIdx ? 20 : 8, height: 8, background: i === activeIdx ? (accounts[i]?.color || '#6C63FF') : '#ffffff22' }} />)}
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Transactions récentes</div>
              <button onClick={() => go('stats')} style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: '#A89CFF', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Voir tout</button>
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
              {[{ id: 'all', name: 'Tout', color: '#A89CFF' }, ...categories].map(c => (
                <button key={c.id} onClick={() => setFilterCat(c.id)} style={{ cursor: 'pointer', padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s', background: filterCat === c.id ? 'rgba(108,99,255,0.35)' : 'transparent', color: filterCat === c.id ? '#A89CFF' : '#ffffff55' }}>{c.name}</button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20 }}>
              {filteredTx.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: '#ffffff22', fontSize: 13 }}>Aucune transaction</div>}
              {filteredTx.slice(0, 10).map(tx => <TxRow key={tx.id} tx={tx} accounts={accounts} pivot={pivot} toPivot={toPivot} />)}
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {page === 'stats' && (
          <div className="fade-up" style={{ paddingBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Statistiques</div>
            <div style={{ fontSize: 11, color: '#ffffff44', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4, marginTop: 16, textAlign: 'center' }}>Patrimoine total</div>
            {dataLoading
              ? <div className="shimmer" style={{ width: 160, height: 36, marginBottom: 20, margin: '0 auto 20px' }} />
              : <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 20, textAlign: 'center' }}>{fmtShort(totalPivot, pivot)}</div>}
            <div className="glass" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: '#A89CFF' }}>Dépenses par catégorie</div>
              <SpendChart transactions={transactions} categories={categories} pivot={pivot} toPivot={toPivot} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#ffffff55', letterSpacing: '.04em' }}>Soldes</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              {accounts.map(acc => {
                const bal = getBalance(acc.id), balP = getBalancePivot(acc.id)
                return (
                  <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <AccountAvatar account={acc} size={40} fontSize={13} />
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{acc.name}</div><div style={{ fontSize: 11, color: '#ffffff44' }}>{displayCur(acc.currency)}</div></div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: bal >= 0 ? '#fff' : '#FB7185' }}>{fmt(bal, acc.currency, isXAF(acc.currency) ? 0 : 2)}</div>
                      <div style={{ fontSize: 10, color: '#ffffff33' }}>≈ {balP !== null ? fmtShort(balP, pivot) : '—'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#ffffff55', letterSpacing: '.04em' }}>Historique complet</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {!transactions.length && <div style={{ textAlign: 'center', padding: '32px 0', color: '#ffffff22', fontSize: 13 }}>Aucune transaction</div>}
              {transactions.map(tx => <TxRow key={tx.id} tx={tx} accounts={accounts} pivot={pivot} toPivot={toPivot} onDelete={handleDeleteTx} swipeable />)}
            </div>
          </div>
        )}

        {/* ── AIDE ── */}
        {page === 'help' && <AidePage />}

        {/* ── PARAMÈTRES ── */}
        {page === 'settings' && (
          <SettingsPage
            session={session} profile={profile}
            accounts={accounts} categories={categories}
            section={settingsSection}
            onSection={sec => go('settings', sec)}
            locale={locale}
            onLocale={l => { setLocale(l); localStorage.setItem('winance_locale', l) }}
            onSaveAccount={handleSaveAccount} onDeleteAccount={handleDeleteAccount} onReorderAccounts={handleReorderAccounts}
            onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory} onReorderCategories={handleReorderCategories}
            onLogout={logout}
          />
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="bnav">
        {[['home', 'home', 'Accueil'], ['stats', 'chart', 'Stats']].map(([pg, ic, lb]) => (
          <button key={pg} className={`ni${page === pg ? ' on' : ''}`} onClick={() => go(pg)}>
            <Icon name={ic} size={22} color={page === pg ? '#A89CFF' : '#ffffff33'} filled={page === pg} />
            <span>{lb}</span>
          </button>
        ))}
        <button className="ni" onClick={() => setShowAdd(true)} style={{ marginTop: -8 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#6C63FF,#4A42CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px #6C63FF55' }}>
            <Icon name="plus" size={24} color="#fff" />
          </div>
        </button>
        {[['help', 'help', 'Aide'], ['settings', 'settings', 'Réglages']].map(([pg, ic, lb]) => (
          <button key={pg} className={`ni${page === pg ? ' on' : ''}`} onClick={() => go(pg)}>
            <Icon name={ic} size={22} color={page === pg ? '#A89CFF' : '#ffffff33'} filled={page === pg} />
            <span>{lb}</span>
          </button>
        ))}
      </div>

      {showAdd && accounts.length > 0 && <AddModal accounts={accounts.filter(a => a.currency)} categories={categories} onClose={() => setShowAdd(false)} onSave={handleAddTx} rates={rates} pivot={pivot} />}
      {showAddAccount && <AccountModal onClose={() => setShowAddAccount(false)} onSave={async (a, b) => { await handleSaveAccount(a, b); setShowAddAccount(false) }} />}
      {showFavModal && <FavoritesModal onDone={saveFavorites} />}
    </div>
  )
}
