import { randomUUID } from 'crypto'
import { Buffer } from 'buffer'
import type { UploadOptions } from '@/lib/storage'
import { storage } from '@/lib/storage'

type ManagedEntity = 'properties' | 'units' | 'leases' | 'payments' | 'maintenance' | 'tenant-profiles'

export interface UploadDocumentParams {
  tenantId: string
  entity: ManagedEntity
  entityId: string
  fileName: string
  file: ArrayBuffer | Uint8Array
  options?: UploadOptions
}

function normalizeFile(file: ArrayBuffer | Uint8Array) {
  return file instanceof Uint8Array ? file : new Uint8Array(file)
}

function buildStorageKey(tenantId: string, entity: ManagedEntity, entityId: string, fileName: string) {
  const safeTenant = tenantId.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
  const safeEntity = entity.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
  const safeEntityId = entityId.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()

  const [name, extension] = fileName.split(/\.(?=[^\.]+$)/)
  const safeName = (name || 'document')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
  const safeExtension = extension ? extension.toLowerCase().replace(/[^a-z0-9]/g, '') : 'bin'

  return `property-management/${safeTenant}/${safeEntity}/${safeEntityId}/${safeName}-${randomUUID()}.${safeExtension}`
}

class DocumentService {
  async upload({ tenantId, entity, entityId, fileName, file, options }: UploadDocumentParams) {
    const key = buildStorageKey(tenantId, entity, entityId, fileName)
    const payload = normalizeFile(file)
    const buffer = Buffer.from(payload)
    const uploadOptions: UploadOptions = {
      cacheControl: 'public, max-age=31536000',
      ...options,
    }

    const { url } = await storage.upload(buffer, key, uploadOptions)
    return { key, url }
  }

  async delete(key: string) {
    await storage.delete(key)
  }

  async publicUrl(key: string) {
    return storage.publicUrl(key)
  }
}

export const documentService = new DocumentService()

