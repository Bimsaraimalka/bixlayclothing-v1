import { LoadingScreen } from '@/components/loading-screen'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen variant="page" />
    </div>
  )
}
