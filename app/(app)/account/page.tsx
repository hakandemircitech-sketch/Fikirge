import Link from 'next/link'
import { planLabel } from '@/lib/dashboard-format'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const plan = profile?.plan ?? 'starter'
  const name = profile?.name ?? ''
  const email = profile?.email ?? user.email ?? ''

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Hesap Ayarları</h1>
          <p>Profil, abonelik ve güvenlik</p>
        </div>
      </div>

      <div className="tabs" style={{ pointerEvents: 'none', opacity: 0.85 }}>
        <button type="button" className="tab active">
          Profil
        </button>
        <button type="button" className="tab">
          Abonelik
        </button>
        <button type="button" className="tab">
          Güvenlik
        </button>
        <button type="button" className="tab">
          API
        </button>
      </div>

      <div className="account-grid">
        <div className="account-card">
          <div className="account-card-title">Profil Bilgileri</div>
          <div className="form-group">
            <label className="form-label" htmlFor="acc-name">
              Ad Soyad
            </label>
            <input className="form-input" id="acc-name" name="name" type="text" defaultValue={name} readOnly />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="acc-email">
              E-posta
            </label>
            <input className="form-input" id="acc-email" type="email" defaultValue={email} readOnly />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="acc-co">
              Şirket / Proje
            </label>
            <input className="form-input" id="acc-co" type="text" placeholder="İsteğe bağlı" readOnly />
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 8 }}>
            Profil düzenleme yakında etkinleştirilecek.
          </p>
        </div>

        <div className="account-card">
          <div className="account-card-title">Mevcut Plan</div>
          <div className="plan-compare">
            <div className={`plan-row${plan === 'starter' ? ' current' : ''}`}>
              <div>
                <div className="plan-row-name">Starter</div>
                <div className="plan-row-price">$0 / ay · 2 kredi</div>
              </div>
              {plan === 'starter' ? <div className="plan-row-badge">Aktif</div> : null}
            </div>
            <div className={`plan-row${plan === 'builder' ? ' current' : ''}`}>
              <div>
                <div className="plan-row-name">Builder</div>
                <div className="plan-row-price">$29 / ay · 15 kredi</div>
              </div>
              {plan === 'builder' ? <div className="plan-row-badge">Aktif</div> : null}
            </div>
            <div className={`plan-row${plan === 'studio' ? ' current' : ''}`}>
              <div>
                <div className="plan-row-name">Studio</div>
                <div className="plan-row-price">$79 / ay · Sınırsız</div>
              </div>
              {plan === 'studio' ? <div className="plan-row-badge">Aktif</div> : null}
            </div>
          </div>
          <Link href="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Panele dön
          </Link>
        </div>

        <div className="account-card">
          <div className="account-card-title">Güvenlik</div>
          <p style={{ fontSize: 13, color: 'var(--muted2)', fontWeight: 300 }}>
            Şifre değişikliği Supabase Auth üzerinden yapılır. OAuth ile giriş yaptıysan şifre gerekmeyebilir.
          </p>
        </div>

        <div className="account-card">
          <div className="account-card-title">Özet</div>
          <p style={{ fontSize: 13, color: 'var(--muted2)', marginBottom: '1rem' }}>
            Plan: <strong style={{ color: 'var(--text)' }}>{planLabel(plan)}</strong>
            <br />
            Kalan kredi:{' '}
            <strong style={{ color: 'var(--text)' }}>{profile?.credits ?? '—'}</strong>
          </p>
          <div className="danger-zone">
            <div className="danger-title">Tehlikeli Bölge</div>
            <div className="danger-desc">
              Hesabı silmek tüm projelerini kalıcı olarak kaldırır. Bu işlem geri alınamaz.
            </div>
            <button type="button" className="btn-danger" disabled>
              Hesabı Sil (yakında)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
