'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { api } from '@/trpc/react'

import PageWithAppbar from '@/components/layout/pageWithAppbar'
import UserForm from '@/components/user/userForm'
import NewUserForm from '@/components/user/newUserForm'
import PageHeader from '@/components/layout/pageHeader'

export default function Profile() {
  const {
    primaryWallet,
    sdkHasLoaded,
    user: walletProviderUser,
  } = useDynamicContext()

  const { data: user } = api.users.getById.useQuery(
    { id: walletProviderUser?.userId ?? '' },
    {
      enabled: Boolean(walletProviderUser?.userId),
    },
  )

  return (
    <PageWithAppbar>
      <div className="page gap-y-8 px-4 text-center">
        <div className="flex w-full flex-col gap-y-4 md:w-2/3 xl:w-2/5">
          <PageHeader pageTitle="profile" />
        </div>
        <div className="w-full px-8 md:w-2/3 lg:w-1/2 xl:w-2/5">
          {sdkHasLoaded &&
            primaryWallet?.address &&
            walletProviderUser?.email &&
            walletProviderUser.userId && (
              <>
                {user ? (
                  <UserForm
                    appWallet={primaryWallet?.address}
                    user={user}
                    walletProviderUser={walletProviderUser}
                  />
                ) : (
                  <NewUserForm
                    appWallet={primaryWallet?.address}
                    walletProviderUser={walletProviderUser}
                  />
                )}
              </>
            )}
        </div>
      </div>
    </PageWithAppbar>
  )
}
