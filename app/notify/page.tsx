import { SiteHeader } from '~/components/common/site-header'
import { NotifyGroup } from '~/components/notify/notify-group'

function NotifyPage() {
  return (
    <div className="h-screen bg-gray-100">
      <SiteHeader />
      <div className="mb-28 mt-4">
        <NotifyGroup />
        <NotifyGroup />
      </div>
    </div>
  )
}

export default NotifyPage
