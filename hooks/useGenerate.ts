'use client'

import { useState } from 'react'
import type { ProjectOutput } from '@/types'

interface GenerateResult {
  project: { id: string; title: string }
  data: ProjectOutput
}

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generate(idea: string): Promise<GenerateResult | null> {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Bir hata oluştu')
        return null
      }

      setResult(json)
      return json
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
      return null
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError(null)
  }

  return { generate, loading, result, error, reset }
}
