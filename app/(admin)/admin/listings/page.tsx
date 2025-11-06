import { Prisma } from '@prisma/client'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { getPublicUrlSync } from '@/lib/storage-utils'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ConvertToPropertyButton } from '@/components/listings/convert-to-property-button'
import Image from 'next/image'
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Home,
  Bed,
  Bath,
  MapPin,
  Upload
} from 'lucide-react'

export default async function ListingsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  const pmEnabled = isPropertyManagementEnabled(tenant.theme)

  let listings: Awaited<ReturnType<typeof db.listing.findMany>> = []
  let statusCounts: Array<{ status: string; _count: { _all: number } }> = []

  try {
    ;[listings, statusCounts] = await Promise.all([
      db.listing.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      db.listing.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { _all: true },
      }),
    ])
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const isConnectionIssue =
      error instanceof Prisma.PrismaClientInitializationError ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') ||
      message.includes("Can't reach database server")

    if (!isConnectionIssue) {
      throw error
    }

    console.warn('[ListingsPage] Falling back to demo listings due to database connectivity issue')
    listings = [
      {
        id: 'demo-listing-1',
        tenantId,
        slug: 'demo-loft-apartment',
        title: 'Demo Loft Apartment',
        status: 'active',
        type: 'rent',
        price: 3250,
        currency: 'USD',
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'apartment',
        addressLine1: '100 Market Street',
        city: 'London',
        postcode: 'EC1A 4AA',
        lat: null,
        lng: null,
        description: 'Placeholder listing shown while the database connection is unavailable.',
        features: ['balcony', 'storage'],
        media: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      },
    ] as any

    statusCounts = [
      {
        status: 'active',
        _count: { _all: listings.length },
      },
    ]
  }

  const totalListings = listings.length
  const activeCount = statusCounts.find(item => item.status === 'active')?._count._all ?? 0
  const draftCount = statusCounts.find(item => item.status === 'draft')?._count._all ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track all your properties</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" asChild size="sm" className="gap-2">
            <Link href="/admin/listings/import">
              <Upload className="h-4 w-4" />
              Import CSV
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/admin/listings/new">
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button className="border-b-2 border-primary pb-4 px-1 text-sm font-medium text-primary">
            Properties
            <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
              {totalListings}
            </span>
          </button>
          <button className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-300">
            Units
          </button>
          <button className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-300">
            Equipment
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search properties..." 
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>Property Type</option>
            <option>House</option>
            <option>Apartment</option>
          </select>
          <select className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>Property Status</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <div className="col-span-4">Property</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {listings.map((listing) => {
              const media = Array.isArray(listing.media) ? listing.media : []
              const firstImage = media[0]
              
              return (
                <div 
                  key={listing.id} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Property */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {(() => {
                        const imageUrl = firstImage?.url || (firstImage?.key ? getPublicUrlSync(firstImage.key) : null)
                        return imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-6 w-6 text-gray-400" />
                          </div>
                        )
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link 
                        href={`/admin/listings/${listing.id}`}
                        className="font-semibold text-gray-900 hover:text-primary line-clamp-1"
                      >
                        {listing.title}
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{listing.city}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {listing.bedrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {listing.bedrooms}
                          </span>
                        )}
                        {listing.bathrooms !== null && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {listing.bathrooms}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {listing.type}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {listing.status === 'active' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                        Active
                      </Badge>
                    ) : listing.status === 'draft' ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                        Draft
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {listing.status}
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <span className="text-sm font-semibold text-gray-900">
                      £{listing.price.toLocaleString()}
                      {listing.type === 'rent' && <span className="text-xs text-gray-500 ml-1">pcm</span>}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {pmEnabled && (
                      <ConvertToPropertyButton
                        listingId={listing.id}
                        listingTitle={listing.title}
                        isAlreadyLinked={!!listing.propertyId}
                        variant="ghost"
                        size="sm"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      asChild
                    >
                      <Link href={`/listing/${listing.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      asChild
                    >
                      <Link href={`/admin/listings/${listing.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}

            {listings.length === 0 && (
              <div className="py-16 text-center">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-sm text-gray-600 mb-6">Get started by adding your first property</p>
                <Button asChild>
                  <Link href="/admin/listings/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
