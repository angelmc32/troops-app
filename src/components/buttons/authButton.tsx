'use client'

import { toast } from 'sonner'
import { Button } from '../ui/button'
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'

type AuthButtonProps = {
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
}

export default function AuthButton({ size = 'default' }: AuthButtonProps) {
  const { handleLogOut, setShowAuthFlow } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()

  function login() {
    if (!isLoggedIn) {
      setShowAuthFlow(true)
    } else {
      toast.warning('user is already logged in')
    }
  }
  async function logout() {
    await handleLogOut()
  }

  return (
    <Button
      onClick={isLoggedIn ? logout : login}
      size={size}
      className="font-medium"
    >
      {isLoggedIn ? 'logout' : 'login'}
    </Button>
  )
}
