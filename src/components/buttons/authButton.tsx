'use client'

import { toast } from 'sonner'
import { Button } from '../ui/button'

type AuthButtonProps = {
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
}

export default function AuthButton({ size }: AuthButtonProps) {
  function onClickHandler() {
    toast.warning('Auth required, go to authButton component to configure')
  }

  return (
    <Button onClick={onClickHandler} size={size} className="font-medium">
      Login
    </Button>
  )
}
