import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Sistem promptu — Fikirge'nin kalbi
const SYSTEM_PROMPT = `Sen Fikirge'nin proje analiz motorusun.
Kullanıcının fikir tanımını alıp 6 modülde kapsamlı bir proje paketi üretiyorsun.

ÇIKTI FORMATI: Yalnızca geçerli JSON döndür. Başka hiçbir şey ekleme.

{
  "projectName": "Önerilen marka ismi",
  "tagline": "Tek cümlelik değer önermesi",
  "score": 85,
  "market": {
    "tam": "Toplam pazar büyüklüğü",
    "sam": "Hedef segment",
    "som": "Gerçekçi hedef",
    "growth": "Yıllık büyüme oranı",
    "trend": "Pazar trendi açıklaması"
  },
  "competitors": [
    {
      "name": "Rakip ismi",
      "description": "Ne yapıyor",
      "weakness": "Zayıf noktası"
    }
  ],
  "brand": {
    "names": ["İsim1", "İsim2", "İsim3"],
    "colors": {
      "primary": "#HEX",
      "secondary": "#HEX",
      "accent": "#HEX"
    },
    "typography": {
      "heading": "Font ismi",
      "body": "Font ismi"
    },
    "tone": "Ses tonu açıklaması",
    "personality": "Marka kişiliği"
  },
  "techStack": {
    "frontend": ["teknoloji1", "teknoloji2"],
    "backend": ["teknoloji1", "teknoloji2"],
    "database": ["teknoloji1"],
    "auth": ["teknoloji1"],
    "payment": ["teknoloji1"],
    "hosting": ["teknoloji1"],
    "extras": ["teknoloji1"]
  },
  "pricing": {
    "model": "Freemium / Subscription / One-time",
    "plans": [
      { "name": "Plan adı", "price": 0, "description": "Açıklama", "features": ["özellik1"] }
    ],
    "arr_target": "Yıl 1 ARR hedefi"
  },
  "roadmap": {
    "phase1": { "title": "MVP", "duration": "6 hafta", "items": ["madde1"] },
    "phase2": { "title": "Büyüme", "duration": "2-3 ay", "items": ["madde1"] },
    "phase3": { "title": "Ölçekleme", "duration": "4-6 ay", "items": ["madde1"] }
  },
  "risks": [
    { "title": "Risk başlığı", "mitigation": "Azaltma stratejisi" }
  ]
}`

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kredi kontrolü
    const { data: profile } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (!profile || profile.credits <= 0) {
      return NextResponse.json(
        { error: 'Yetersiz kredi. Lütfen planınızı yükseltin.' },
        { status: 402 }
      )
    }

    // İstek gövdesini al
    const { idea } = await request.json()
    if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
      return NextResponse.json(
        { error: 'Geçerli bir fikir giriniz (min 10 karakter)' },
        { status: 400 }
      )
    }

    // Claude API çağrısı
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Şu fikri analiz et ve proje paketini oluştur:\n\n"${idea.trim()}"`,
        },
      ],
    })

    // JSON parse
    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    let projectData
    try {
      projectData = JSON.parse(rawText)
    } catch {
      return NextResponse.json(
        { error: 'AI çıktısı işlenemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    // Projeyi veritabanına kaydet
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title: projectData.projectName || idea.slice(0, 60),
        idea: idea.trim(),
        status: 'completed',
        output: projectData,
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Krediyi düş
    await supabase
      .from('users')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)

    // Kredi hareketini logla
    await supabase.from('credit_logs').insert({
      user_id: user.id,
      project_id: project.id,
      amount: -1,
      type: 'generate',
    })

    return NextResponse.json({
      success: true,
      project,
      data: projectData,
    })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
