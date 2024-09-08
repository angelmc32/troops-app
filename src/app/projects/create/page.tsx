'use client'

import PageHeader from '@/components/layout/pageHeader'
import PageWithAppbar from '@/components/layout/pageWithAppbar'
import ProjectForm from '@/components/projects/projectForm'
import Spinner from '@/components/ux/spinner'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function CreateProject() {
  const { sdkHasLoaded, user: walletProviderUser } = useDynamicContext()

  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        <div className="flex w-full flex-col gap-y-4 md:w-2/3 xl:w-2/5">
          <PageHeader pageTitle="create project" />
        </div>
        <div className="w-full px-8 md:w-2/3 lg:w-1/2 xl:w-2/5">
          {sdkHasLoaded && walletProviderUser?.userId ? (
            <ProjectForm walletProviderUser={walletProviderUser} />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </PageWithAppbar>
  )
}
