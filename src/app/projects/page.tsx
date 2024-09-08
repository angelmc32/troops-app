'use client'

import PageWithAppbar from '@/components/layout/pageWithAppbar'
import { api } from '@/trpc/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import PageHeader from '@/components/layout/pageHeader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Projects() {
  const { data: projects, isFetched } = api.projects.getAll.useQuery()
  const router = useRouter()

  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        <div className="flex w-full flex-col gap-y-4 md:w-2/3 xl:w-2/5">
          <PageHeader pageTitle="projects" />
          <Link href="/projects/create">
            <Button>create</Button>
          </Link>
        </div>
        <div className="w-full px-8 md:w-4/5">
          {isFetched ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects?.map((project) => (
                <Card
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.idea}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                  <CardFooter>
                    <p>{project.category}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center py-16 lg:py-12">
              <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
              <p className="text-xl">loading...</p>
            </div>
          )}
        </div>
      </div>
    </PageWithAppbar>
  )
}
