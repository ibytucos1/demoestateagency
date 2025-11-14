import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Building2,
  Construction,
  Clock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default async function PropertyManagementPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id

  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="border-2 shadow-xl">
          <CardContent className="pt-12 pb-12 px-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative p-6 bg-gradient-to-br from-primary to-primary/80 rounded-full">
                  <Construction className="h-12 w-12 text-white" />
        </div>
        </div>
      </div>

            {/* Badge */}
            <div className="flex justify-center mb-4">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Currently in Development
              </Badge>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
              Property Management
            </h1>
            <p className="text-lg text-center text-gray-600 mb-8">
              Coming Soon
            </p>

            {/* Description */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
              <p className="text-center text-gray-700 leading-relaxed mb-4">
                We're building something amazing! The Property Management module will provide comprehensive tools for managing your portfolio.
              </p>
              
              {/* Feature List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Property & Unit Management</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Tenant Profiles & Leases</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Maintenance Tracking</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Rent Collection & Payments</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 min-w-[160px]">
                <Link href="/admin/listings">
                  <Building2 className="h-4 w-4" />
                  View Listings
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 min-w-[160px]">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
        </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Stay tuned for updates!</span>
              </p>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
