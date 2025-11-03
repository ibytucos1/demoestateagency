import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

interface ListingCardProps {
  listing: {
    id: string
    slug: string
    title: string
    addressLine1: string
    city: string
    price: number
    type: string
    bedrooms?: number | null
    bathrooms?: number | null
    media: any
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const media = listing.media as any[]
  const firstImage = media?.[0]

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/listing/${listing.slug}`}>
        <div className="aspect-video relative bg-muted">
          {firstImage?.key ? (
            <Image
              src={firstImage.key}
              alt={firstImage.alt || listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
          <CardDescription>
            {listing.addressLine1}, {listing.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground capitalize">
              {listing.type}
            </span>
          </div>
          {listing.bedrooms && listing.bathrooms && (
            <p className="text-sm text-muted-foreground mt-2">
              {listing.bedrooms} bed • {listing.bathrooms} bath
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}

