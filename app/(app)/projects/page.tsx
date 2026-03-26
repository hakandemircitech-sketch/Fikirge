import Link from 'next/link'
import { FilterRow } from '@/components/dashboard/FilterRow'
import { ProjectRows } from '@/components/dashboard/ProjectRows'
import { projectsThisMonth } from '@/lib/dashboard-format'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = projects ?? []
  const total = list.length
  const completed = list.filter((p) => p.status === 'completed').length
  const draft = list.filter((p) => p.status === 'draft').length
  const processing = list.filter((p) => p.status === 'processing').length
  const month = projectsThisMonth(list)

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Projelerim</h1>
          <p>
            Toplam {total} proje · {month} bu ay
          </p>
        </div>
        <Link href="/dashboard#quick-start" className="btn-primary">
          + Yeni Proje
        </Link>
      </div>

      <FilterRow
        labels={[
          `Tümü (${total})`,
          `Tamamlanan (${completed})`,
          `Taslak (${draft})`,
          `Yeni (${processing})`,
          `Bu Ay (${month})`,
        ]}
      />

      <ProjectRows projects={list} />
    </>
  )
}
