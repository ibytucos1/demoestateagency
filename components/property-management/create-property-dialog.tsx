'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, Loader2 } from 'lucide-react'

const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().optional(),
  country: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  ownerPhone: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

export function CreatePropertyDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  })

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/property-management/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create property')
      }

      const result = await response.json()
      
      // Close dialog and reset form
      setOpen(false)
      reset()
      
      // Refresh the page to show new property
      router.refresh()
      
      // Optionally navigate to the new property
      // router.push(`/admin/property-management/${result.property.id}`)
    } catch (error) {
      console.error('Failed to create property:', error)
      alert(error instanceof Error ? error.message : 'Failed to create property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
          <DialogDescription>
            Add a new building or complex to your portfolio. You can add units after creating the property.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Riverside Apartments"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="code">Property Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., RSA-001"
                    {...register('code')}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the property..."
                  rows={3}
                  {...register('description')}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Address</h3>
              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  placeholder="Street address"
                  {...register('addressLine1')}
                />
                {errors.addressLine1 && (
                  <p className="text-xs text-red-600 mt-1">{errors.addressLine1.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, etc. (optional)"
                  {...register('addressLine2')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., London"
                    {...register('city')}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    placeholder="e.g., SW1A 1AA"
                    {...register('postcode')}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g., United Kingdom"
                  {...register('country')}
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Owner Information</h3>
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  placeholder="Property owner or manager"
                  {...register('ownerName')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="owner@example.com"
                    {...register('ownerEmail')}
                  />
                  {errors.ownerEmail && (
                    <p className="text-xs text-red-600 mt-1">{errors.ownerEmail.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Owner Phone</Label>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    placeholder="+44 20 1234 5678"
                    {...register('ownerPhone')}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                reset()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

