'use client'

import { useState } from 'react'

const EXAMPLES: { short: string; full: string }[] = [
  { short: 'AI Fiyatlama', full: 'E-ticaret için AI destekli fiyatlama motoru' },
  { short: 'Freelancer Araç', full: 'Freelancerlar için proje yönetim aracı' },
  { short: 'Restoran SaaS', full: 'Restoranlar için dijital menü SaaS platformu' },
  { short: 'B2B CRM', full: 'B2B satış ekipleri için CRM alternatifi' },
]

export function QuickStartCard() {
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<'idle' | 'busy' | 'done'>('idle')

  function run() {
    if (!value.trim()) return
    setPhase('busy')
    window.setTimeout(() => {
      setPhase('done')
      window.setTimeout(() => {
        setPhase('idle')
        setValue('')
      }, 2000)
    }, 2200)
  }

  return (
    <div className="quick-section" id="quick-start">
      <div className="quick-section-title">// hızlı başlat</div>
      <div className="quick-card">
        <h2>Yeni proje oluştur</h2>
        <p>
          Fikrini tek cümleyle anlat. Pazar analizi, marka kimliği, teknik altyapı — hepsini saniyeler içinde
          hazırlayalım.
        </p>
        <div className="quick-input-row">
          <input
            className="quick-input"
            type="text"
            placeholder="örn. yapay zeka destekli muhasebe uygulaması kurmak istiyorum..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={phase !== 'idle'}
            onClick={run}
            style={
              phase === 'done'
                ? { background: 'var(--green)' }
                : undefined
            }
          >
            {phase === 'idle' && 'Analiz Başlat →'}
            {phase === 'busy' && '⏳ Analiz ediliyor...'}
            {phase === 'done' && '✓ Tamamlandı!'}
          </button>
        </div>
        <div className="quick-tags">
          <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', marginRight: 4 }}>
            Örnek fikirler:
          </span>
          {EXAMPLES.map((ex) => (
            <button key={ex.short} type="button" className="quick-tag" onClick={() => setValue(ex.full)}>
              {ex.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
