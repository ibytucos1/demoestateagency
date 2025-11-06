import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => {
  const property = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }

  const listing = {
    findUnique: vi.fn(),
    update: vi.fn(),
  }

  const lease = {
    findFirst: vi.fn(),
  }

  return {
    db: {
      property,
      listing,
      lease,
    },
  }
})

import { db } from '@/lib/db'
import { propertyService } from '@/lib/property-management/property-service'

describe('PropertyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists properties scoped to tenant', async () => {
    const tenantId = 'tenant-123'
    const mockedFindMany = vi.mocked(db.property.findMany)
    mockedFindMany.mockResolvedValueOnce([])

    await propertyService.list(tenantId, { search: 'HQ' })

    expect(mockedFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId }),
      }),
    )
  })

  it('syncListingStatus updates listing when leases change', async () => {
    const mockedListingFind = vi.mocked(db.listing.findUnique)
    const mockedLeaseFind = vi.mocked(db.lease.findFirst)
    const mockedListingUpdate = vi.mocked(db.listing.update)

    mockedListingFind.mockResolvedValueOnce({
      id: 'listing-1',
      tenantId: 'tenant-1',
      propertyId: 'property-1',
      status: 'active',
    } as any)

    mockedLeaseFind.mockResolvedValueOnce({ id: 'lease-1' } as any)
    mockedListingUpdate.mockResolvedValueOnce({ id: 'listing-1', status: 'let' } as any)

    const result = await propertyService.syncListingStatus('listing-1')

    expect(result).toEqual(expect.objectContaining({ status: 'let' }))
    expect(mockedListingUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'listing-1' },
        data: { status: 'let' },
      }),
    )
  })
})


