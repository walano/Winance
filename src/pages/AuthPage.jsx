import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#1a0533 0%,#0d0221 60%,#120830 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Inter', sans-serif", color: '#fff',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        .google-btn {
          width: 100%; cursor: pointer; border-radius: 14px; padding: 15px 20px;
          font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          transition: all .2s; border: none;
          background: #fff; color: #1a1a1a;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        .google-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .google-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .fade-up { animation: fadeUp .4s ease; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <div className="fade-up" style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'linear-gradient(135deg,#6C63FF,#4A42CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 20px 50px #6C63FF50',
          }}>
            <svg viewBox="0 0 24 24" width="34" height="34">
              <rect x="1" y="6" width="22" height="15" rx="2" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <path d="M1 10h22" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="17" cy="15" r="1.2" fill="#fff"/>
            </svg>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px' }}>Winance</div>
          <div style={{ fontSize: 14, color: '#ffffff44', marginTop: 8, lineHeight: 1.6 }}>
            Multi-currency personal finance.<br />Free, forever.
          </div>
        </div>

        {/* Google button */}
        <button className="google-btn" onClick={signInWithGoogle} disabled={loading}>
          {loading ? (
            <span style={{ fontSize: 14, color: '#666' }}>Redirecting to Google...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.2H42V20H24v8h11.3C33.6 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.6-.4-3.8z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.4 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.3-11.3-8H6.4C9.7 35.5 16.4 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.2H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37.2 39 44 34 44 24c0-1.3-.1-2.6-.4-3.8z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#ffffff22', lineHeight: 1.8 }}>
          By continuing, you agree to our Terms of Service.<br/>
          Your data is private and never shared.
        </div>
      </div>
    </div>
  )
}
