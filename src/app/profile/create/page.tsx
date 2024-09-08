import PageHeader from '@/components/layout/pageHeader'
import PageWithAppbar from '@/components/layout/pageWithAppbar'
// import NewUserForm from '@/components/user/newUserForm'

export default function CreateProfile() {
  return (
    <PageWithAppbar>
      <div className="page gap-y-8 text-center">
        <div className="flex w-full flex-col gap-y-4 md:w-2/3 xl:w-2/5">
          <PageHeader pageTitle="crete profile" />
        </div>
        <div className="w-full px-8 md:w-2/3 lg:w-1/2 xl:w-2/5">
          {/* <NewUserForm /> */}
        </div>
      </div>
    </PageWithAppbar>
  )
}
