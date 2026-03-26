'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@/types/database'
import {
  displayName,
  initialsFrom,
  planCreditCap,
  planLabel,
} from '@/lib/dashboard-format'

const titles: Record<string, [string, string]> = {
  '/dashboard': ['Dashboard', '/ ana sayfa'],
  '/projects': ['Projelerim', '/ tüm projeler'],
  '/stats': ['İstatistikler', '/ kullanım analizi'],
  '/account': ['Hesap Ayarları', '/ profil & abonelik'],
}

function navItemClass(pathname: string, href: string) {
  return `nav-item${pathname === href ? ' active' : ''}`
}

export function DashboardChrome({
  user,
  profile,
  projectCount,
  children,
}: {
  user: { email?: string }
  profile: User | null
  projectCount: number
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [title, crumb] = titles[pathname] ?? titles['/dashboard']
  const name = displayName(profile?.name, user.email)
  const initials = initialsFrom(profile?.name, user.email)
  const plan = profile?.plan ?? 'starter'
  const badge = planLabel(plan)
  const credits = profile?.credits ?? 0
  const cap = planCreditCap(plan)
  const creditLine =
    cap != null ? `${planLabel(plan)} Plan · ${credits} kredi` : `${planLabel(plan)} Plan · sınırsız`

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/dashboard" className="sidebar-logo-text">
            Fikir<span>ge</span>
          </Link>
          <div className="sidebar-logo-badge">{badge}</div>
        </div>

        <div className="sidebar-new">
          <Link href="/dashboard#quick-start" className="btn-new">
            <span className="plus">+</span>
            Yeni Proje Başlat
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Ana Menü</div>
          <Link className={navItemClass(pathname, '/dashboard')} href="/dashboard">
            <span className="nav-icon">⬛</span> Dashboard
          </Link>
          <Link className={navItemClass(pathname, '/projects')} href="/projects">
            <span className="nav-icon">📁</span> Projelerim
            <span className="nav-badge">{projectCount}</span>
          </Link>
          <Link className={navItemClass(pathname, '/stats')} href="/stats">
            <span className="nav-icon">📊</span> İstatistikler
          </Link>

          <div className="nav-group-label">Ayarlar</div>
          <Link className={navItemClass(pathname, '/account')} href="/account">
            <span className="nav-icon">👤</span> Hesabım
          </Link>
          <Link className={navItemClass(pathname, '/account')} href="/account">
            <span className="nav-icon">💳</span> Abonelik
          </Link>
          <span className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <span className="nav-icon">🔑</span> API Erişimi
          </span>

          <div className="nav-group-label">Destek</div>
          <span className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <span className="nav-icon">📖</span> Belgeler
          </span>
          <span className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <span className="nav-icon">💬</span> Destek
          </span>
          <Link className="nav-item" href="/">
            <span className="nav-icon">🏠</span> Ana Sayfa
          </Link>
        </nav>

        <Link href="/account" className="sidebar-user" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{name}</div>
            <div className="user-plan">{creditLine}</div>
          </div>
          <div className="user-more">⋯</div>
        </Link>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">{title}</div>
            <div className="topbar-breadcrumb">{crumb}</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <span className="search-icon">🔍</span>
              <input type="search" placeholder="Proje ara..." aria-label="Proje ara" />
            </div>
            <div className="topbar-notif" role="button" tabIndex={0} aria-label="Bildirimler">
              🔔
              <div className="notif-dot" />
            </div>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </>
  )
}
