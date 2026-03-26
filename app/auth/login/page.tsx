'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080a0f',
    }}>
      <div style={{
        background: '#0e1118',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '2.5rem',
        width: 400,
      }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#eef0f8' }}>
          Launch<span style={{ color: '#0057FF' }}>Forge</span>
        </h1>
        <p style={{ color: '#7a849e', fontSize: 13, marginBottom: 32 }}>
          Hesabına giriş yap
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            color: '#eef0f8',
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          Google ile Giriş Yap
        </button>

        <div style={{ textAlign: 'center', color: '#4a5068', fontSize: 12, marginBottom: 24 }}>— veya —</div>

        {/* Email Login */}
        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: '#7a849e', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
              E-POSTA
            </label>
            <input
              name="email"
              type="email"
              required
              style={{
                width: '100%',
                background: '#141820',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#eef0f8',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, color: '#7a849e', display: 'block', marginBottom: 6, fontFamily: 'monospace' }}>
              ŞİFRE
            </label>
            <input
              name="password"
              type="password"
              required
              style={{
                width: '100%',
                background: '#141820',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#eef0f8',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#0057FF',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 13,
              fontFamily: 'monospace',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Giriş Yap →
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#4a5068' }}>
          Hesabın yok mu?{' '}
          <a href="/auth/register" style={{ color: '#3d7fff' }}>Kayıt ol</a>
        </p>
      </div>
    </div>
  )
}
