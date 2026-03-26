import Link from 'next/link'
import { FilterRow } from '@/components/dashboard/FilterRow'
import { ProjectRows } from '@/components/dashboard/ProjectRows'
import { QuickStartCard } from '@/components/dashboard/QuickStartCard'
import {
  creditLogLabel,
  displayName,
  formatRelativeTr,
  planCreditCap,
  planLabel,
  projectsThisMonth,
} from '@/lib/dashboard-format'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = projects ?? []
  const recent = list.slice(0, 5)

  const { data: logs } = await supabase
    .from('credit_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const name = displayName(profile?.name, user.email)
  const plan = profile?.plan ?? 'starter'
  const credits = profile?.credits ?? 0
  const cap = planCreditCap(plan)
  const total = list.length
  const monthCount = projectsThisMonth(list)
  const used = cap != null ? Math.max(0, cap - credits) : null
  const pct = cap != null && cap > 0 ? Math.min(100, Math.round((credits / cap) * 100)) : 100

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Merhaba, {name} 👋</h1>
          <p>
            {total > 0
              ? `Toplam ${total} proje · Bu ay ${monthCount} yeni`
              : 'İlk projeni oluşturmak için aşağıdaki kutuya fikrini yaz.'}
          </p>
        </div>
        <a href="#quick-start" className="btn-primary">
          + Yeni Proje
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Toplam Proje</div>
            <div className="stat-icon blue">📁</div>
          </div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">
            {monthCount > 0 ? (
              <>
                <span className="up">↑ {monthCount}</span> bu ay
              </>
            ) : (
              <span>Henüz bu ay yeni yok</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Kalan Kredi</div>
            <div className="stat-icon amber">⚡</div>
          </div>
          <div className="stat-value">{cap != null ? credits : '∞'}</div>
          <div className="stat-sub">
            {cap != null ? (
              <>
                {cap} krediden <span className="down">{used} kullanıldı</span>
              </>
            ) : (
              <span>Studio planı</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Bu Ay Üretilen</div>
            <div className="stat-icon green">✨</div>
          </div>
          <div className="stat-value">{monthCount}</div>
          <div className="stat-sub">
            <span className="up">↑</span> bu ay oluşturulan proje
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-label">Plan</div>
            <div className="stat-icon red">📅</div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            {planLabel(plan)}
          </div>
          <div className="stat-sub">Abonelik detayı için hesap sayfası</div>
        </div>
      </div>

      <QuickStartCard />

      <div className="main-grid">
        <div>
          <div className="section-header">
            <div className="section-header-title">Son Projeler</div>
            <Link className="section-header-action" href="/projects">
              Tümünü gör →
            </Link>
          </div>
          <FilterRow labels={['Tümü', 'Tamamlanan', 'Taslak', 'Bu Ay']} />
          <ProjectRows projects={recent} />
        </div>

        <div className="right-col">
          <div className="plan-card">
            <div className="plan-card-top">
              <div className="plan-card-name">AKTİF PLAN</div>
              <div className="plan-badge">{planLabel(plan)}</div>
            </div>
            <div className="plan-credit-label">Aylık kredi kullanımı</div>
            <div className="credit-bar-wrap">
              <div className="credit-bar" style={{ width: `${pct}%` }} />
            </div>
            <div className="credit-count">
              <span>{used != null ? `${used} kullanıldı` : '—'}</span>
              <span>{cap != null ? `${credits} kaldı / ${cap}` : 'Sınırsız'}</span>
            </div>
            <Link href="/account" className="upgrade-btn" style={{ textDecoration: 'none' }}>
              ⚡ Planı yönet
            </Link>
          </div>

          <div className="activity-card">
            <div className="section-header" style={{ marginBottom: '0.75rem' }}>
              <div className="section-header-title">Son Aktivite</div>
            </div>
            <div className="activity-list">
              {(logs ?? []).length === 0 ? (
                <div className="activity-item">
                  <div className="activity-dot-wrap">
                    <div className="activity-dot muted" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">Henüz kayıtlı aktivite yok.</div>
                    <div className="activity-time">—</div>
                  </div>
                </div>
              ) : (
                (logs ?? []).map((log, i) => (
                  <div key={log.id} className="activity-item">
                    <div className="activity-dot-wrap">
                      <div
                        className={`activity-dot ${i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'green' : 'amber'}`}
                      />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{creditLogLabel(log.type)}</strong>
                        {log.amount !== 0 ? ` · ${log.amount > 0 ? '+' : ''}${log.amount} kredi` : null}
                      </div>
                      <div className="activity-time">{formatRelativeTr(log.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
