import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { projectId, format } = await request.json()
    // format: 'pdf' | 'notion' | 'zip' | 'link'

    // Projeyi çek ve sahipliği doğrula
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 })

    switch (format) {
      case 'link': {
        // Paylaşılabilir link oluştur
        const shareToken = crypto.randomUUID()
        await supabase
          .from('exports')
          .insert({ project_id: projectId, format: 'link', token: shareToken })
        const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${shareToken}`
        return NextResponse.json({ url })
      }

      case 'zip': {
        // TODO: ZIP oluşturma — archiver paketi ile yapılacak
        // Şimdilik JSON döndür
        return NextResponse.json({
          message: 'ZIP export yakında aktif olacak',
          data: project.output,
        })
      }

      case 'pdf': {
        // TODO: PDF oluşturma — @react-pdf/renderer ile yapılacak
        return NextResponse.json({
          message: 'PDF export yakında aktif olacak',
        })
      }

      case 'notion': {
        // TODO: Notion API entegrasyonu
        return NextResponse.json({
          message: 'Notion export yakında aktif olacak',
        })
      }

      default:
        return NextResponse.json({ error: 'Geçersiz format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export başarısız' }, { status: 500 })
  }
}
