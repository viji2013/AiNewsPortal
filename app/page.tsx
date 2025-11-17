import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/actions'

export default async function Home() {
  const user = await getUser()
  
  // Redirect to feed if logged in, otherwise to login
  if (user) {
    redirect('/feed')
  } else {
    redirect('/login')
  }
}
