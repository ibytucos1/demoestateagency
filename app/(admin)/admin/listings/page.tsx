import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ListingsPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  const listings = await db.listing.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Listings</h1>
        <Button asChild>
          <Link href="/admin/listings/new">Create Listing</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <Link href={`/admin/listings/${listing.id}`}>{listing.title}</Link>
                </CardTitle>
                <span className={`px-2 py-1 rounded text-xs ${
                  listing.status === 'active' ? 'bg-green-100 text-green-800' :
                  listing.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {listing.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">
                    {listing.addressLine1}, {listing.city}
                  </p>
                  <p className="font-semibold mt-1">
                    ${listing.price.toLocaleString()} • {listing.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/listing/${listing.slug}`}>View</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/listings/${listing.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {listings.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No listings yet. Create your first one!
          </p>
        )}
      </div>
    </div>
  )
}

