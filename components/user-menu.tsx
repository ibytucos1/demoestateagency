'use client'

import { createClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

interface UserMenuProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  if (!user) {
    return (
      <Link href="/sign-in">
        <Button variant="ghost">Sign In</Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right text-sm">
        <div className="font-medium">{user.name || user.email}</div>
        <div className="text-muted-foreground text-xs capitalize">{user.role}</div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

