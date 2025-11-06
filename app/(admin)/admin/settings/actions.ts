"use server"

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/rbac'

type Context = {
  tenantId: string
  tenantSlug: string
}

export async function updateWhatsappNumber(
  context: Context,
  formData: FormData
): Promise<void> {
  const { tenantId, tenantSlug } = context
  await requireAuth(tenantSlug, ['owner', 'admin'])

  const rawValue = typeof formData.get('whatsappNumber') === 'string' ? (formData.get('whatsappNumber') as string) : ''
  let whatsappNumber = rawValue.trim()

  if (whatsappNumber.length === 0) {
    whatsappNumber = ''
  }

  if (whatsappNumber) {
    whatsappNumber = whatsappNumber.replace(/[^+\d]/g, '')
    if (whatsappNumber.startsWith('00')) {
      whatsappNumber = `+${whatsappNumber.slice(2)}`
    }
    if (!whatsappNumber.startsWith('+')) {
      whatsappNumber = `+${whatsappNumber}`
    }
  }

  await db.tenant.update({
    where: { id: tenantId },
    data: { whatsappNumber: whatsappNumber || null },
  })

  revalidatePath('/admin/settings')
}

