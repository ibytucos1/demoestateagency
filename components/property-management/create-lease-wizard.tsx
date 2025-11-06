'use client'

import { useState, useEffect } from 'react'
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
import { FileText, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const leaseSchema = z.object({
  unitId: z.string().min(1, 'Please select a unit'),
  tenantProfileId: z.string().min(1, 'Please select a tenant'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  rentAmount: z.coerce.number().positive('Rent amount must be positive'),
  depositAmount: z.coerce.number().nonnegative().optional().or(z.literal('')),
  billingInterval: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUALLY']),
  noticePeriodDays: z.coerce.number().int().min(0).optional().or(z.literal('')),
  generateMonths: z.coerce.number().int().min(0).max(36).optional().or(z.literal('')),
})

type LeaseFormData = z.infer<typeof leaseSchema>

interface Unit {
  id: string
  label: string
  floor?: string
  bedrooms?: number
  bathrooms?: number
  rentAmount?: number
  Property: {
    name: string
  }
}

interface TenantProfile {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export function CreateLeaseWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [units, setUnits] = useState<Unit[]>([])
  const [tenants, setTenants] = useState<TenantProfile[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      billingInterval: 'MONTHLY',
      generateMonths: 12,
      noticePeriodDays: 30,
    },
  })

  const selectedUnitId = watch('unitId')
  const selectedTenantId = watch('tenantProfileId')
  const selectedUnit = units.find((u) => u.id === selectedUnitId)
  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)

  // Load available units and tenants when dialog opens
  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    setLoadingData(true)
    try {
      // Load all properties to get vacant units
      const propsResponse = await fetch('/api/property-management/properties')
      const propsData = await propsResponse.json()
      
      // Flatten units from all properties
      const allUnits: Unit[] = []
      for (const property of propsData.properties) {
        const unitsResponse = await fetch(`/api/property-management/units?propertyId=${property.id}`)
        const unitsData = await unitsResponse.json()
        allUnits.push(...unitsData.units.filter((u: any) => u.status === 'VACANT').map((u: any) => ({
          ...u,
          Property: { name: property.name },
        })))
      }
      setUnits(allUnits)

      // Load tenant profiles
      const tenantsResponse = await fetch('/api/property-management/tenants')
      const tenantsData = await tenantsResponse.json()
      setTenants(tenantsData.tenantProfiles)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const onSubmit = async (data: LeaseFormData) => {
    setIsSubmitting(true)
    try {
      const cleanedData = {
        unitId: data.unitId,
        tenantProfileId: data.tenantProfileId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        rentAmount: data.rentAmount,
        depositAmount: data.depositAmount === '' ? undefined : data.depositAmount,
        status: 'ACTIVE',
        billingInterval: data.billingInterval,
        noticePeriodDays: data.noticePeriodDays === '' ? 30 : data.noticePeriodDays,
      }

      const generateMonths = data.generateMonths === '' ? 0 : data.generateMonths
      const url = `/api/property-management/leases${generateMonths ? `?generateMonths=${generateMonths}` : ''}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create lease')
      }

      // Close dialog and reset
      setOpen(false)
      setStep(1)
      reset()
      
      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error('Failed to create lease:', error)
      alert(error instanceof Error ? error.message : 'Failed to create lease')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Create Lease
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lease</DialogTitle>
          <DialogDescription>
            Step {step} of 3 - {step === 1 ? 'Select Unit' : step === 2 ? 'Select Tenant' : 'Lease Terms'}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Select Unit */}
            {step === 1 && (
              <div className="space-y-4">
                <Label>Select a Vacant Unit *</Label>
                {units.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">No vacant units available</p>
                    <p className="text-xs text-gray-500 mt-1">Create units first or wait for units to become vacant</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {units.map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => {
                          setValue('unitId', unit.id)
                          // Pre-fill rent amount if available
                          if (unit.rentAmount) {
                            setValue('rentAmount', unit.rentAmount)
                          }
                        }}
                        className={`text-left p-4 border-2 rounded-lg transition-all ${
                          selectedUnitId === unit.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{unit.label}</div>
                            <div className="text-sm text-gray-600">{unit.Property.name}</div>
                            {unit.floor && (
                              <div className="text-xs text-gray-500">Floor: {unit.floor}</div>
                            )}
                          </div>
                          <div className="text-right">
                            {unit.bedrooms !== null && unit.bedrooms !== undefined && (
                              <Badge variant="secondary" className="mr-1">
                                {unit.bedrooms} bed
                              </Badge>
                            )}
                            {unit.rentAmount && (
                              <div className="text-sm font-medium text-gray-900 mt-1">
                                £{unit.rentAmount.toLocaleString()}/mo
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {errors.unitId && (
                  <p className="text-xs text-red-600">{errors.unitId.message}</p>
                )}
              </div>
            )}

            {/* Step 2: Select Tenant */}
            {step === 2 && (
              <div className="space-y-4">
                <Label>Select Tenant Profile *</Label>
                {tenants.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">No tenant profiles available</p>
                    <p className="text-xs text-gray-500 mt-1">Create tenant profiles first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {tenants.map((tenant) => (
                      <button
                        key={tenant.id}
                        type="button"
                        onClick={() => setValue('tenantProfileId', tenant.id)}
                        className={`text-left p-4 border-2 rounded-lg transition-all ${
                          selectedTenantId === tenant.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {tenant.firstName} {tenant.lastName}
                        </div>
                        {tenant.email && (
                          <div className="text-sm text-gray-600">{tenant.email}</div>
                        )}
                        {tenant.phone && (
                          <div className="text-xs text-gray-500">{tenant.phone}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {errors.tenantProfileId && (
                  <p className="text-xs text-red-600">{errors.tenantProfileId.message}</p>
                )}
              </div>
            )}

            {/* Step 3: Lease Terms */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Lease Summary</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Unit:</span> {selectedUnit?.Property.name} - {selectedUnit?.label}</p>
                    <p><span className="font-medium">Tenant:</span> {selectedTenant?.firstName} {selectedTenant?.lastName}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Lease Start Date *</Label>
                    <Input id="startDate" type="date" {...register('startDate')} />
                    {errors.startDate && (
                      <p className="text-xs text-red-600 mt-1">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endDate">Lease End Date (Optional)</Label>
                    <Input id="endDate" type="date" {...register('endDate')} />
                  </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rentAmount">Monthly Rent (£) *</Label>
                    <Input
                      id="rentAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('rentAmount')}
                    />
                    {errors.rentAmount && (
                      <p className="text-xs text-red-600 mt-1">{errors.rentAmount.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="depositAmount">Security Deposit (£)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('depositAmount')}
                    />
                  </div>
                </div>

                {/* Billing & Terms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingInterval">Billing Interval</Label>
                    <Select
                      defaultValue="MONTHLY"
                      onValueChange={(value) => setValue('billingInterval', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="ANNUALLY">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="noticePeriodDays">Notice Period (Days)</Label>
                    <Input
                      id="noticePeriodDays"
                      type="number"
                      min="0"
                      {...register('noticePeriodDays')}
                    />
                  </div>
                </div>

                {/* Payment Generation */}
                <div>
                  <Label htmlFor="generateMonths">Auto-Generate Payments (Months)</Label>
                  <Input
                    id="generateMonths"
                    type="number"
                    min="0"
                    max="36"
                    {...register('generateMonths')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically create payment schedule for the next N months (0 to skip)
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <div>
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    setStep(1)
                    reset()
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} disabled={step === 1 && !selectedUnitId || step === 2 && !selectedTenantId}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Lease
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

