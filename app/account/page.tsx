import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      {/* TODO: Hesap ayarları bileşeni buraya gelecek */}
      <pre style={{ color: '#fff', padding: '2rem', fontSize: 12 }}>
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  )
}
