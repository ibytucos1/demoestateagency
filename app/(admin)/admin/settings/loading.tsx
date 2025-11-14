import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div>
      {/* Page Title */}
      <Skeleton className="h-9 w-32 mb-8" />

      {/* Tenant Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-52" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full max-w-xl mb-4" />
          <div className="space-y-4">
            {/* Contact Phone Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-3 w-full max-w-lg" />
            </div>

            {/* Contact Email Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-3 w-full max-w-lg" />
            </div>

            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Contact Card */}
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-3 w-full max-w-lg" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

