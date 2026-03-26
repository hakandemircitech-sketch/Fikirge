'use client'

import { useMemo } from 'react'

/** Basit görsel — gerçek metrik bağlantısı sonra eklenebilir */
export function UsageChart() {
  const barData = useMemo(
    () => [1, 0, 2, 0, 1, 3, 0, 0, 2, 1, 0, 1, 0, 0, 3, 0, 2, 1, 0, 0, 1, 2, 0, 0, 1, 0, 2, 3, 1, 2],
    []
  )
  const maxVal = Math.max(...barData)

  return (
    <div className="usage-chart">
      <div className="chart-title">Günlük Kullanım (Bu Ay)</div>
      <div className="chart-bars">
        {barData.map((v, i) => (
          <div key={i} className="chart-bar-wrap">
            <div
              className={`chart-bar${i === barData.length - 1 ? ' today' : ''}`}
              style={{ height: v === 0 ? 4 : Math.round((v / maxVal) * 64) }}
              title={`Gün ${i + 1}: ${v} analiz`}
            />
            <div className="chart-bar-label">{(i + 1) % 5 === 0 ? i + 1 : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
