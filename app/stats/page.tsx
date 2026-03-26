import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StatsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: logs } = await supabase
    .from('credit_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* TODO: İstatistikler bileşeni buraya gelecek */}
      <pre style={{ color: '#fff', padding: '2rem', fontSize: 12 }}>
        {JSON.stringify(logs, null, 2)}
      </pre>
    </div>
  )
}
