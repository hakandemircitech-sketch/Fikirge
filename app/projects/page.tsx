import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* TODO: Projeler listesi bileşeni buraya gelecek */}
      <pre style={{ color: '#fff', padding: '2rem', fontSize: 12 }}>
        {JSON.stringify(projects, null, 2)}
      </pre>
    </div>
  )
}
