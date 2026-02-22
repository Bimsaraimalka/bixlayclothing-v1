import { LoadingScreen } from '@/components/loading-screen'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-100 [&_.text-primary]:!text-gray-900 [&_.text-muted-foreground]:!text-gray-600">
      <LoadingScreen />
    </div>
  )
}
