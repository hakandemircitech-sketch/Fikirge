'use client'

import { useState } from 'react'

export function FilterRow({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(0)
  return (
    <div className="filter-row">
      {labels.map((l, i) => (
        <button
          key={l}
          type="button"
          className={`filter-btn${active === i ? ' active' : ''}`}
          onClick={() => setActive(i)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
