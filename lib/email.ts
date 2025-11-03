import { Resend } from 'resend'
import { env } from './env'

const resend = new Resend(env.RESEND_API_KEY)

export interface LeadNotificationData {
  tenantName: string
  listingTitle?: string
  listingSlug?: string
  name: string
  email: string
  phone?: string
  message: string
}

export class EmailService {
  private fromEmail = env.RESEND_FROM_EMAIL || 'noreply@example.com'
  private toEmail = env.RESEND_TO_EMAIL || env.RESEND_FROM_EMAIL || 'admin@example.com'

  /**
   * Send lead notification email
   */
  async sendLeadNotification(data: LeadNotificationData): Promise<void> {
    const subject = data.listingTitle
      ? `New lead for: ${data.listingTitle}`
      : `New lead from ${data.name}`

    const listingInfo = data.listingTitle
      ? `<p><strong>Listing:</strong> ${data.listingTitle}<br/>
         <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/listing/${data.listingSlug}">View listing</a></p>`
      : ''

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Lead - ${data.tenantName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>New Lead Received</h2>
          ${listingInfo}
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
          <h3>Message</h3>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 0.9em;">This is an automated notification from ${data.tenantName}.</p>
        </body>
      </html>
    `

    try {
      await resend.emails.send({
        from: this.fromEmail,
        to: this.toEmail,
        replyTo: data.email,
        subject,
        html,
      })
    } catch (error) {
      console.error('Failed to send lead notification email:', error)
      // Don't throw - email failures shouldn't break the lead creation
    }
  }
}

export const emailService = new EmailService()

