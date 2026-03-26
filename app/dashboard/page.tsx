// TODO: Dashboard içeriği burada olacak.
// Hazır HTML → fikirge-dashboard.html dosyasından bu dosyaya taşınacak.
// Bileşen bazlı yapıya dönüştürülecek:
//   - <Sidebar />
//   - <Topbar />
//   - <StatCards />
//   - <QuickStartCard />
//   - <ProjectList />
//   - <CreditCard />
//   - <ActivityFeed />

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Giriş yapılmamışsa login'e yönlendir
  if (!user) redirect('/auth/login')

  // Kullanıcının projelerini çek
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Kullanıcı profilini çek
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      {/* TODO: Dashboard bileşenleri buraya gelecek */}
      <pre style={{ color: '#fff', padding: '2rem', fontSize: 12 }}>
        {JSON.stringify({ user: user.email, projects, profile }, null, 2)}
      </pre>
    </div>
  )
}
