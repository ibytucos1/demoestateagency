import { getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenantId = await getTenantId()
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { slug: true },
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const listings = await db.listing.findMany({
    where: {
      tenantId,
      status: 'active',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    ...listings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  return routes
}

