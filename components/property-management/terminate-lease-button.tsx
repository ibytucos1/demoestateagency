'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface TerminateLeaseButtonProps {
  leaseId: string
  tenantName?: string | null
  unitLabel: string
}

export function TerminateLeaseButton({ leaseId, tenantName, unitLabel }: TerminateLeaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleTerminate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/property-management/leases/${leaseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to terminate lease')
      }

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to terminate lease:', error)
      alert(`Failed to terminate lease: ${error instanceof Error ? error.message : 'An error occurred'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          End Lease
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terminate Lease</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to terminate the lease for <strong>{unitLabel}</strong>
              {tenantName && (
                <>
                  {' '}
                  with <strong>{tenantName}</strong>
                </>
              )}
              ?
            </p>
            <p className="text-sm">
              This will:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Mark the lease as <strong>TERMINATED</strong></li>
              <li>Set the unit status back to <strong>VACANT</strong></li>
              <li>Keep all payment history for records</li>
            </ul>
            <p className="text-sm font-medium text-amber-600 mt-3">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleTerminate()
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Terminate Lease
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

