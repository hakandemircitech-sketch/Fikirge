import type { Project } from '@/types/database'
import {
  formatRelativeTr,
  ideaSnippet,
  statusClass,
  statusLabel,
} from '@/lib/dashboard-format'

const PALETTES = [
  'rgba(0,87,255,0.12)',
  'rgba(245,158,11,0.12)',
  'rgba(0,214,143,0.1)',
  'rgba(0,87,255,0.08)',
  'rgba(255,107,53,0.1)',
  'rgba(0,87,255,0.06)',
]

const ICONS = ['🤖', '🛒', '🏥', '📊', '🎓', '🏠']

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length]
}

function hash(s: string) {
  let h = 0
  for (let k = 0; k < s.length; k++) h = (h + s.charCodeAt(k)) % 997
  return h
}

export function ProjectRows({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <div className="project-list">
        <div
          style={{
            border: '1px dashed var(--border2)',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--muted2)',
            fontSize: 13,
          }}
        >
          Henüz proje yok. Yukarıdan ilk fikrini yazarak başla.
        </div>
      </div>
    )
  }

  return (
    <div className="project-list">
      {projects.map((p) => {
        const h = hash(p.id)
        const bg = pick(PALETTES, h)
        const icon = pick(ICONS, h)
        return (
          <div key={p.id} className="project-card">
            <div className="project-icon" style={{ background: bg }}>
              {icon}
            </div>
            <div className="project-info">
              <div className="project-name">{p.title}</div>
              <div className="project-desc">{ideaSnippet(p.idea)}</div>
            </div>
            <div className="project-meta">
              <span className={`project-status ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
              <span className="project-date">{formatRelativeTr(p.created_at)}</span>
              <div className="project-actions">
                <div className="project-action-btn" title="İndir">
                  ⬇
                </div>
                <div className="project-action-btn" title="Düzenle">
                  ✏
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
