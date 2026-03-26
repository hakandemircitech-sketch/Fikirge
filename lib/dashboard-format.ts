import type { CreditLogType, Plan, Project, ProjectStatus } from '@/types/database'

const MONTH_NAMES = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
]

export function planLabel(plan: Plan): string {
  if (plan === 'starter') return 'Starter'
  if (plan === 'builder') return 'Builder'
  return 'Studio'
}

export function planCreditCap(plan: Plan): number | null {
  if (plan === 'starter') return 2
  if (plan === 'builder') return 15
  return null
}

export function initialsFrom(name: string | null | undefined, email: string | undefined): string {
  const base = (name || email || '?').trim()
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2)
  }
  return base.slice(0, 2).toUpperCase()
}

export function displayName(
  name: string | null | undefined,
  email: string | undefined
): string {
  if (name?.trim()) return name.trim()
  return email?.split('@')[0] || 'Kullanıcı'
}

export function statusLabel(status: ProjectStatus): string {
  if (status === 'completed') return 'Tamamlandı'
  if (status === 'draft') return 'Taslak'
  return 'Yeni'
}

export function statusClass(status: ProjectStatus): string {
  if (status === 'completed') return 'done'
  if (status === 'draft') return 'draft'
  return 'new'
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}

export function formatRelativeTr(iso: string): string {
  const d = new Date(iso)
  const t = d.getTime()
  if (Number.isNaN(t)) return '—'
  const diff = Date.now() - t
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'Az önce'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} dk önce`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}s önce`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}g önce`
  return formatShortDate(iso)
}

export function ideaSnippet(idea: string, max = 72): string {
  const t = idea.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function creditLogLabel(type: CreditLogType): string {
  if (type === 'generate') return 'Kredi kullanımı'
  if (type === 'refund') return 'İade'
  if (type === 'purchase') return 'Satın alma'
  return 'Bonus'
}

export function projectsThisMonth(projects: Pick<Project, 'created_at'>[]): number {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  return projects.filter((p) => {
    const d = new Date(p.created_at)
    return d.getFullYear() === y && d.getMonth() === m
  }).length
}
