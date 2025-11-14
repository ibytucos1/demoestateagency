'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileText, 
  MapPin, 
  Home, 
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  Tag,
  Save,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  key: string
  url: string
  width?: number | null
  height?: number | null
  alt?: string
}

interface ListingEditorProps {
  listing?: any
}

export function ListingEditor({ listing }: ListingEditorProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaItem[]>(Array.isArray(listing?.media) ? listing.media : [])
  const [formData, setFormData] = useState({
    title: listing?.title || '',
    slug: listing?.slug || '',
    status: listing?.status || 'draft',
    type: listing?.type || 'sale',
    price: listing?.price || '',
    currency: listing?.currency || 'USD',
    bedrooms: listing?.bedrooms || '',
    bathrooms: listing?.bathrooms || '',
    squareFeet: listing?.squareFeet || '',
    propertyType: listing?.propertyType || '',
    addressLine1: listing?.addressLine1 || '',
    addressLine2: listing?.addressLine2 || '',
    city: listing?.city || '',
    state: listing?.state || '',
    postcode: listing?.postcode || '',
    country: listing?.country || 'United Kingdom',
    description: listing?.description || '',
    features: (listing?.features || []).join(', '),
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        return data.media
      })

      const uploadedMedia = await Promise.all(uploadPromises)
      setMedia((prev) => [...prev, ...uploadedMedia])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        squareFeet: formData.squareFeet ? Number(formData.squareFeet) : null,
        addressLine2: formData.addressLine2 || null,
        state: formData.state || null,
        country: formData.country || null,
        features: formData.features
          .split(',')
          .map((feature: string) => feature.trim())
          .filter((feature: string) => feature.length > 0),
        media: media,
      }

      const url = listing
        ? `/api/listings/${listing.id}`
        : '/api/listings'
      const method = listing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save listing')
      }

      router.push('/admin/listings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            {listing ? 'Edit Property' : 'Create New Property'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {listing ? 'Update property details and information' : 'Fill in the details below to list a new property'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <p className="text-sm text-gray-600 mt-0.5">Property title, status, and pricing</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Property Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Luxury 3 Bedroom Apartment in Central London"
                className="h-11 border-2 focus:border-primary"
                required
              />
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>This will be the main heading for your property listing</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                URL Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="luxury-3-bed-apartment-london"
                className="h-11 border-2 focus:border-primary font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>URL-friendly version (lowercase, hyphens, no spaces)</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="sold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Sold
                      </div>
                    </SelectItem>
                    <SelectItem value="let">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Let
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Listing Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="350000"
                  className="h-11 border-2 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) => setFormData({ ...formData, currency: v })}
                >
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">£ GBP</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Property Details</CardTitle>
                <p className="text-sm text-gray-600 mt-0.5">Specifications and features</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Bed className="h-4 w-4 text-emerald-600" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="3"
                  className="h-11 border-2 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Bath className="h-4 w-4 text-emerald-600" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="2"
                  className="h-11 border-2 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFeet" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-emerald-600" />
                  Square Feet
                </Label>
                <Input
                  id="squareFeet"
                  type="number"
                  min="0"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  placeholder="1200"
                  className="h-11 border-2 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-semibold text-gray-700">Property Type</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(v) => setFormData({ ...formData, propertyType: v })}
              >
                <SelectTrigger className="h-11 border-2">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-600" />
                Features
              </Label>
              <Input
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="parking, garden, balcony, pool, gym"
                className="h-11 border-2 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>Separate multiple features with commas</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Address & Location</CardTitle>
                <p className="text-sm text-gray-600 mt-0.5">Property location details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="123 Main Street"
                className="h-11 border-2 focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2" className="text-sm font-semibold text-gray-700">
                Address Line 2
              </Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Apartment, suite, unit, building, floor (optional)"
                className="h-11 border-2 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="London"
                  className="h-11 border-2 focus:border-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                  State / County / Region
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Greater London, Essex"
                  className="h-11 border-2 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-sm font-semibold text-gray-700">
                  Postcode / ZIP
                </Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="SW1A 1AA"
                  className="h-11 border-2 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(v) => setFormData({ ...formData, country: v })}
                >
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Description</CardTitle>
                <p className="text-sm text-gray-600 mt-0.5">Detailed property information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Property Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={10}
              placeholder="Describe the property in detail: key features, amenities, nearby locations, and what makes it special..."
              className="border-2 focus:border-amber-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 flex items-start gap-1.5 pt-1">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span>Write a compelling description highlighting the property's best features</span>
            </p>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-600 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Property Photos</CardTitle>
                  <p className="text-sm text-gray-600 mt-0.5">Upload high-quality images</p>
                </div>
              </div>
              {media.length > 0 && (
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-900">
                  {media.length} {media.length === 1 ? 'photo' : 'photos'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || loading}
                className="sr-only"
              />
              <label
                htmlFor="photo-upload"
                className={cn(
                  "flex flex-col items-center justify-center gap-3 min-h-[160px] px-4 py-8 border-2 border-dashed rounded-xl transition-all cursor-pointer",
                  uploading || loading
                    ? "opacity-50 cursor-not-allowed pointer-events-none bg-gray-50 border-gray-300"
                    : "hover:bg-cyan-50 hover:border-cyan-500 border-gray-300"
                )}
              >
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Upload className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {uploading ? 'Uploading images...' : 'Click to upload photos'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item, index) => (
                  <div key={item.key || index} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group-hover:border-cyan-500 transition-colors">
                      {item.url ? (
                        <Image
                          src={item.url}
                          alt={item.alt || `Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {media.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">No photos uploaded</p>
                <p className="text-xs text-gray-500">Click the upload button above to add photos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 text-red-900 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={loading || uploading}
            size="lg"
            className="gap-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Property
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

