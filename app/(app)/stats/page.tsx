import { UsageChart } from '@/components/dashboard/UsageChart'
import { projectsThisMonth } from '@/lib/dashboard-format'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StatsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('created_at, status')
    .eq('user_id', user.id)

  const list = projects ?? []
  const monthCount = projectsThisMonth(list as { created_at: string }[])
  const downloads = 0

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>İstatistikler</h1>
          <p>Kullanım özeti — detaylı raporlar yakında</p>
        </div>
      </div>

      <div className="tabs" style={{ pointerEvents: 'none', opacity: 0.85 }}>
        <button type="button" className="tab active">
          Bu Ay
        </button>
        <button type="button" className="tab">
          Son 3 Ay
        </button>
        <button type="button" className="tab">
          Tüm Zamanlar
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Bu Ay Oluşturulan</div>
            <div className="stat-icon blue">📊</div>
          </div>
          <div className="stat-value">{monthCount}</div>
          <div className="stat-sub">proje</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">İndirme</div>
            <div className="stat-icon green">⬇</div>
          </div>
          <div className="stat-value">{downloads}</div>
          <div className="stat-sub">PDF + Notion (yakında)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Toplam Proje</div>
            <div className="stat-icon amber">⏱</div>
          </div>
          <div className="stat-value">{list.length}</div>
          <div className="stat-sub">kayıtlı proje</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Tamamlanan</div>
            <div className="stat-icon red">✓</div>
          </div>
          <div className="stat-value">{list.filter((p) => p.status === 'completed').length}</div>
          <div className="stat-sub">durum: tamamlandı</div>
        </div>
      </div>

      <UsageChart />

      <div className="account-grid">
        <div className="account-card">
          <div className="account-card-title">Modül kullanımı (özet)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '0.5rem' }}>
            {[
              ['Pazar Analizi', 100],
              ['Marka Kimliği', 87],
              ['Teknik Stack', 75],
              ['Rakip Haritası', 62],
              ['Yol Haritası', 50],
            ].map(([label, w]) => (
              <div key={String(label)}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: 'var(--muted3)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--blue-light)' }}>{w}%</span>
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: 100, height: 4 }}>
                  <div
                    style={{
                      width: `${w}%`,
                      height: '100%',
                      background: 'var(--blue)',
                      borderRadius: 100,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="account-card">
          <div className="account-card-title">Kategori dağılımı (örnek)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '0.5rem' }}>
            {[
              ['var(--blue)', 'SaaS / B2B', '—'],
              ['var(--green)', 'HealthTech', '—'],
              ['var(--amber)', 'E-ticaret', '—'],
              ['var(--orange)', 'EdTech', '—'],
              ['var(--muted)', 'Diğer', '—'],
            ].map(([c, lab, n]) => (
              <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: c,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'var(--muted3)', flex: 1 }}>{lab}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted2)' }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
