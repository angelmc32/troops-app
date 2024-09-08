import { LoaderCircle } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex w-full flex-col items-center py-16">
      <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
      <p className="text-xl">loading...</p>
    </div>
  )
}
