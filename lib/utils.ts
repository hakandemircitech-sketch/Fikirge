import { clsx, type ClassValue } from 'clsx'

// Tailwind class birleştirici
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Tarihi okunabilir formata çevir
export function formatDate(date: string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (hours < 1) return 'Az önce'
  if (hours < 24) return `${hours} saat önce`
  if (days < 7) return `${days} gün önce`
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

// Plan adını Türkçe döndür
export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    starter: 'Starter',
    builder: 'Builder',
    studio: 'Studio',
  }
  return labels[plan] || plan
}

// Kredi durumu rengi
export function getCreditColor(credits: number, max: number): string {
  const ratio = credits / max
  if (ratio > 0.5) return '#00D68F'
  if (ratio > 0.2) return '#F59E0B'
  return '#FF4D4D'
}

// Skor rengi
export function getScoreColor(score: number): string {
  if (score >= 75) return '#00D68F'
  if (score >= 50) return '#F59E0B'
  return '#FF4D4D'
}

// Stripe checkout'a yönlendir
export async function redirectToCheckout(plan: 'builder' | 'studio') {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}
