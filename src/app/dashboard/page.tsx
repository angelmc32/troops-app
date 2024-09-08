'use client'

import Link from 'next/link'

import PageWithAppbar from '@/components/layout/pageWithAppbar'
import { Button } from '@/components/ui/button'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { api } from '@/trpc/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user: walletProviderUser } = useDynamicContext()
  const router = useRouter()

  const { data: user, isFetched: isUserFetched } = api.users.getById.useQuery(
    { id: walletProviderUser?.userId ?? '' },
    {
      enabled: Boolean(walletProviderUser?.userId),
    },
  )

  useEffect(() => {
    if (isUserFetched) {
      if (!user?.id) {
        router.push('/profile/create')
      }
    }
  }, [isUserFetched, router, user?.id])

  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        <h2>gm</h2>
        <Link href="/">
          <Button className={`mt-6 h-12 text-lg md:mt-8 lg:mt-8 xl:mt-12`}>
            back
          </Button>
        </Link>
      </div>
    </PageWithAppbar>
  )
}
