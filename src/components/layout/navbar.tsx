'use client'

import Image from 'next/image'
import Link from 'next/link'
import MobileMenu from './mobileMenu'
import { usePathname } from 'next/navigation'
import AuthButton from '@/components/buttons/authButton'

export type MenuItemType = {
  displayText: string
  href: string
  isMobileOnly: boolean
}

const MENU_ITEMS: MenuItemType[] = [
  { displayText: 'home', href: '/', isMobileOnly: true },
  { displayText: 'features', href: '/features', isMobileOnly: false },
  { displayText: 'how it works', href: '/how-it-works', isMobileOnly: false },
  { displayText: 'about', href: '/about', isMobileOnly: false },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 h-20 w-full bg-black">
      <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between p-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-5 lg:px-8">
        <div>
          <Link className="flex w-16 items-center" href="/">
            <Image
              src="/icons/icon-192x192.png"
              alt="troopie: an animated blob that takes the shape of the communities it is a part of"
              width={512}
              height={512}
              className="h-10 w-10 transition duration-300 ease-in-out hover:scale-90"
            />
            <span className="sr-only">troops</span>
          </Link>
        </div>
        <div className="z-10 col-span-3 flex items-center justify-center">
          <nav className="hidden gap-6 lg:flex">
            {MENU_ITEMS.filter((menuItem) => !menuItem.isMobileOnly).map(
              (menuItem, index) => (
                <Link
                  key={`${menuItem.displayText}-menuItem-${index}`}
                  className={`inline-flex items-center justify-center px-4 py-2 text-lg font-medium text-white transition-colors hover:text-primary focus:text-primary focus:outline-none ${
                    pathname === menuItem.href &&
                    'pointer-events-none underline decoration-primary decoration-[1.5px] underline-offset-[6px] hover:!text-foreground'
                  }`}
                  href={menuItem.href}
                >
                  {menuItem.displayText}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="hidden lg:flex lg:justify-end">
          <AuthButton />
        </div>
        <MobileMenu menuItems={MENU_ITEMS} pathname={pathname} />
      </div>
    </header>
  )
}
