'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
