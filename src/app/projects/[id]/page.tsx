'use client'

import PageHeader from '@/components/layout/pageHeader'
import PageWithAppbar from '@/components/layout/pageWithAppbar'
import ProjectProfile from '@/components/projects/projectProfile'
import PageLoader from '@/components/ux/pageLoader'
import { api } from '@/trpc/react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function Project({ params }: { params: { id: string } }) {
  const { user: walletProviderUser } = useDynamicContext()

  const { data: project } = api.projects.getById.useQuery({ id: params.id })

  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        {project && walletProviderUser ? (
          <>
            <div className="flex w-full flex-col gap-y-4 md:w-2/3 xl:w-2/5">
              <PageHeader pageTitle={project?.name} />
            </div>
            <div className="w-full px-8 md:w-2/3 lg:w-1/2 xl:w-2/5">
              <ProjectProfile
                project={project}
                walletProviderUser={walletProviderUser}
              />
            </div>
          </>
        ) : (
          <PageLoader />
        )}
      </div>
    </PageWithAppbar>
  )
}
