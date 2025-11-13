"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  redirect('/admin/settings?success=whatsapp')
}

export async function updateContactInfo(
  context: Context,
  formData: FormData
): Promise<void> {
  const { tenantId, tenantSlug } = context
  await requireAuth(tenantSlug, ['owner', 'admin'])

  // Process contact phone
  const rawPhone = typeof formData.get('contactPhone') === 'string' ? (formData.get('contactPhone') as string) : ''
  let contactPhone = rawPhone.trim()

  if (contactPhone.length > 0) {
    contactPhone = contactPhone.replace(/[^+\d]/g, '')
    if (contactPhone.startsWith('00')) {
      contactPhone = `+${contactPhone.slice(2)}`
    }
    if (!contactPhone.startsWith('+')) {
      contactPhone = `+${contactPhone}`
    }
  }

  // Process contact email
  const rawEmail = typeof formData.get('contactEmail') === 'string' ? (formData.get('contactEmail') as string) : ''
  const contactEmail = rawEmail.trim()

  // Update the tenant's contact info (shown on all property cards)
  await db.tenant.update({
    where: { id: tenantId },
    data: {
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
    },
  })

  revalidatePath('/admin/settings')
  revalidatePath('/search')
  redirect('/admin/settings?success=contact')
}

