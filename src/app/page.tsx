import AuthButton from '@/components/buttons/authButton'
import PageWithAppbar from '@/components/layout/pageWithAppbar'

export default function Home() {
  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        <h1>
          a third space for <br />
          <span className="text-primary font-bold">onchain communities</span>
        </h1>
        <AuthButton size="lg" />
      </div>
    </PageWithAppbar>
  )
}
