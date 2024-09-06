'use client'

import { type ReactNode } from 'react'
import { TRPCReactProvider } from '@/trpc/react'
import {
  DynamicContextProvider,
  type UserProfile,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { useRouter } from 'next/navigation'

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export default function OnchainProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const handlers = {
    handleVerifiedUser: async ({ user }: { user: UserProfile }) => {
      console.log('handleBeforeAuth was called', user)

      router.push('/profile')
      // if (!user.userId) {
      //   toast.error('something went wrong, please try again later')
      // }

      // // handle GET /api/user call > get or create user
      // const existingUser = api.users.getById.useQuery({ id: user.userId ?? '' })
      // console.log(existingUser.data)
      // // const existingUser = await api.users.getById({ id: user.userId ?? '' })

      // if (!existingUser) {
      //   router.push('/u/create')
      // } else {
      //   router.push('/u')
      // }
    },
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? 'ENV_ID',
        handlers,
        siweStatement:
          'welcome to troops. sign to prove that you are the owner of the wallet you are connecting. signing is free and does not trigger an onchain transaction.',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <TRPCReactProvider>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </TRPCReactProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}
