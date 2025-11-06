'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { updateListingStatusAction, deleteListingAction } from '@/app/(admin)/admin/listings/actions'
import { Loader2, PauseCircle, PlayCircle, Trash2 } from 'lucide-react'

interface ListingActionsProps {
  listingId: string
  currentStatus: string
}

const statusPriority: Record<string, number> = {
  active: 3,
  draft: 2,
  sold: 1,
  let: 1,
}

export function ListingActions({ listingId, currentStatus }: ListingActionsProps) {
  const [isPending, startTransition] = useTransition()

  const setStatus = (status: string) => {
    startTransition(async () => {
      await updateListingStatusAction({ listingId, status })
    })
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to permanently delete this listing?')
    if (!confirmed) return
    startTransition(async () => {
      await deleteListingAction({ listingId })
    })
  }

  const nextStatus = currentStatus === 'active' ? 'draft' : 'active'
  const toggleLabel = currentStatus === 'active' ? 'Mark as Draft' : 'Publish'
  const ToggleIcon = currentStatus === 'active' ? PauseCircle : PlayCircle

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={currentStatus === 'active' ? 'outline' : 'default'}
        size="sm"
        disabled={isPending || statusPriority[currentStatus] === statusPriority[nextStatus]}
        onClick={() => setStatus(nextStatus)}
        className="flex items-center gap-2"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ToggleIcon className="h-4 w-4" />}
        <span>{toggleLabel}</span>
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={handleDelete}
        className="flex items-center gap-2"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        <span>Delete</span>
      </Button>
    </div>
  )
}

