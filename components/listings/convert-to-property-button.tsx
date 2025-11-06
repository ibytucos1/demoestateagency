'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, CheckCircle2 } from 'lucide-react'

interface ConvertToPropertyButtonProps {
  listingId: string
  listingTitle: string
  isAlreadyLinked?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ConvertToPropertyButton({
  listingId,
  listingTitle,
  isAlreadyLinked = false,
  variant = 'outline',
  size = 'sm',
}: ConvertToPropertyButtonProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const router = useRouter()

  const handleConvert = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/listings/${listingId}/convert-to-property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createUnit: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert listing')
      }

      setSuccess(true)
      setPropertyId(data.property.id)
      
      // Refresh the page after a short delay
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error('Failed to convert listing:', error)
      alert(error instanceof Error ? error.message : 'Failed to convert listing to property')
      setIsSubmitting(false)
    }
  }

  if (isAlreadyLinked) {
    return (
      <Button variant="ghost" size={size} disabled className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        Already Managed
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Add to Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convert to Managed Property</DialogTitle>
          <DialogDescription>
            Move this listing to your Property Management portfolio for operational tracking.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Successfully Converted!</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{listingTitle}</strong> has been added to your property portfolio.
            </p>
            {propertyId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/property-management/${propertyId}`)}
              >
                View Property
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">What will be created:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>A new <strong>Property</strong> using the listing's address and details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>A <strong>Unit</strong> with bedroom/bathroom information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Link to this listing for easy cross-reference</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> This won't affect your marketing listing. It creates a separate property for portfolio management, lease tracking, and maintenance.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Listing Details</Label>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <strong>{listingTitle}</strong>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleConvert} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Convert to Property
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

