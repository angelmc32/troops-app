'use client'

import { type ReactNode } from 'react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { http } from 'viem'
import { sepolia } from 'viem/chains'
import { TRPCReactProvider } from '@/trpc/react'

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
})

export default function OnchainProvider({ children }: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? 'ENV_ID',
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

// function AccountInfo() {
//   const { address, isConnected, chain } = useAccount();

//   return (
//     <div>
//       <p>
//         wagmi connected: {isConnected ? 'true' : 'false'}
//       </p>
//       <p>wagmi address: {address}</p>
//       <p>wagmi network: {chain?.id}</p>
//     </div>
//   );
// };
