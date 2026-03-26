import '@/app/styles/dashboard-scoped.css'
import { DashboardChrome } from '@/components/dashboard/DashboardChrome'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div id="db-root" className="min-h-screen h-screen w-full">
      <DashboardChrome user={user} profile={profile} projectCount={count ?? 0}>
        {children}
      </DashboardChrome>
    </div>
  )
}
