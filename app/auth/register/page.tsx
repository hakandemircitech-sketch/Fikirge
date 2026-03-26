'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleEmailSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setMessage(
      'Kayıt alındı. Supabase’de e-posta doğrulaması açıksa gelen kutunu kontrol et; kapalıysa giriş sayfasından dene.'
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080a0f',
      }}
    >
      <div
        style={{
          background: '#0e1118',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '2.5rem',
          width: 400,
        }}
      >
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 8,
            color: '#eef0f8',
          }}
        >
          Fikir<span style={{ color: '#0057FF' }}>ge</span>
        </h1>
        <p style={{ color: '#7a849e', fontSize: 13, marginBottom: 32 }}>Deneme hesabı oluştur</p>

        <button
          type="button"
          onClick={handleGoogleSignup}
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
          Google ile devam et
        </button>

        <div style={{ textAlign: 'center', color: '#4a5068', fontSize: 12, marginBottom: 24 }}>— veya —</div>

        <form onSubmit={handleEmailSignup}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 11,
                color: '#7a849e',
                display: 'block',
                marginBottom: 6,
                fontFamily: 'monospace',
              }}
            >
              E-POSTA
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ornek@email.com"
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
            <label
              style={{
                fontSize: 11,
                color: '#7a849e',
                display: 'block',
                marginBottom: 6,
                fontFamily: 'monospace',
              }}
            >
              ŞİFRE (en az 6 karakter)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
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
            Hesap oluştur →
          </button>
        </form>

        {message ? (
          <p style={{ marginTop: 16, fontSize: 12, color: '#a0aab8', lineHeight: 1.5 }}>{message}</p>
        ) : null}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#4a5068' }}>
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" style={{ color: '#3d7fff' }}>
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  )
}
