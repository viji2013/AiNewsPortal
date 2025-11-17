import dynamic from 'next/dynamic'
import { PageLoader } from '@/components/ui/Loading'

// Lazy load admin components
export const AdminDashboard = dynamic(() => import('@/app/admin/page'), {
  loading: () => <PageLoader />,
  ssr: false,
})

// Lazy load modals
export const ShareModal = dynamic(
  () => import('@/components/article/ShareModal').then((mod) => ({ default: mod.ShareModal })),
  {
    loading: () => null,
    ssr: false,
  }
)

export const AddToCollectionModal = dynamic(
  () =>
    import('@/components/article/AddToCollectionModal').then((mod) => ({
      default: mod.AddToCollectionModal,
    })),
  {
    loading: () => null,
    ssr: false,
  }
)

// Lazy load settings form
export const SettingsForm = dynamic(
  () => import('@/components/settings/SettingsForm').then((mod) => ({ default: mod.SettingsForm })),
  {
    loading: () => <PageLoader />,
    ssr: false,
  }
)
