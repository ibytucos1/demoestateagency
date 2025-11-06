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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2 } from 'lucide-react'

const unitSchema = z.object({
  label: z.string().min(1, 'Unit label is required'),
  floor: z.string().optional(),
  bedrooms: z.coerce.number().int().min(0).optional().or(z.literal('')),
  bathrooms: z.coerce.number().int().min(0).optional().or(z.literal('')),
  squareFeet: z.coerce.number().int().min(0).optional().or(z.literal('')),
  status: z.enum(['VACANT', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']).optional(),
  rentAmount: z.coerce.number().nonnegative().optional().or(z.literal('')),
  deposit: z.coerce.number().nonnegative().optional().or(z.literal('')),
  availableFrom: z.string().optional(),
  notes: z.string().optional(),
})

type UnitFormData = z.infer<typeof unitSchema>

interface CreateUnitDialogProps {
  propertyId: string
}

export function CreateUnitDialog({ propertyId }: CreateUnitDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      status: 'VACANT',
    },
  })

  const onSubmit = async (data: UnitFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up empty string values
      const cleanedData = {
        ...data,
        propertyId,
        bedrooms: data.bedrooms === '' ? undefined : data.bedrooms,
        bathrooms: data.bathrooms === '' ? undefined : data.bathrooms,
        squareFeet: data.squareFeet === '' ? undefined : data.squareFeet,
        rentAmount: data.rentAmount === '' ? undefined : data.rentAmount,
        deposit: data.deposit === '' ? undefined : data.deposit,
        availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString() : undefined,
      }

      const response = await fetch('/api/property-management/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create unit')
      }

      // Close dialog and reset form
      setOpen(false)
      reset()
      
      // Refresh the page to show new unit
      router.refresh()
    } catch (error) {
      console.error('Failed to create unit:', error)
      alert(error instanceof Error ? error.message : 'Failed to create unit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Unit</DialogTitle>
          <DialogDescription>
            Add a new unit (apartment, flat, or suite) to this property.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Unit Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Unit Label *</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Apt 101, Unit A"
                    {...register('label')}
                  />
                  {errors.label && (
                    <p className="text-xs text-red-600 mt-1">{errors.label.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    placeholder="e.g., Ground, 1st, 2nd"
                    {...register('floor')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register('bedrooms')}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register('bathrooms')}
                  />
                </div>
                <div>
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register('squareFeet')}
                  />
                </div>
              </div>
            </div>

            {/* Status & Availability */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Status & Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue="VACANT"
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VACANT">Vacant</SelectItem>
                      <SelectItem value="OCCUPIED">Occupied</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="RESERVED">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    {...register('availableFrom')}
                  />
                </div>
              </div>
            </div>

            {/* Rent Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Rent Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentAmount">Monthly Rent (£)</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register('rentAmount')}
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit (£)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register('deposit')}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this unit..."
                rows={3}
                {...register('notes')}
              />
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
              Create Unit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

