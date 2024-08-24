import React from 'react'

import { HydrateClient } from '@/trpc/server'
import Navbar from './navbar'
import Footer from './footer'

const NAVBAR_HEIGHT = '64px' // 5rem / h-20 tw

export interface NavbarProps {
  title?: string
  navTitle?: string
}

const PageWithAppbar: React.FC<NavbarProps & { children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <HydrateClient>
      <Navbar />
      <main
        className={`min-h-[calc(100vh-64px)] top-[${NAVBAR_HEIGHT}] flex w-full flex-col items-center overflow-x-hidden`}
      >
        {children}
      </main>
      <Footer />
    </HydrateClient>
  )
}

export default PageWithAppbar
