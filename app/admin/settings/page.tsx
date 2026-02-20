import { AdminLayout } from '@/components/admin/admin-layout'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin and store settings (coming soon)</p>
        </div>
        <div className="bg-background border border-border rounded-xl shadow-sm p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Settings such as store details, notifications, and admin users can be configured here in a future update.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
