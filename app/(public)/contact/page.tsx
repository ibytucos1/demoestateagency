import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us',
}

export default async function ContactPage() {
  const tenant = await getTenant()
  const { db } = await import('@/lib/db')
  
  // Get contact email from tenant's owner/admin user, or generate from tenant slug
  let contactEmail = `hello@${tenant.slug.toLowerCase().replace(/\s+/g, '-')}.com`
  try {
    const adminUser = await db.user.findFirst({
      where: {
        tenantId: tenant.id,
        role: { in: ['owner', 'admin'] },
      },
      select: { email: true },
      orderBy: { createdAt: 'asc' },
    })
    if (adminUser?.email) {
      contactEmail = adminUser.email
    }
  } catch (error) {
    // Fall back to generated email
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: tenant.whatsappNumber || '+44 (0) 20 1234 5678',
      link: tenant.whatsappNumber ? `tel:${tenant.whatsappNumber.replace(/\s+/g, '')}` : 'tel:+442012345678',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Mail,
      title: 'Email',
      content: contactEmail,
      link: `mailto:${contactEmail}`,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 High Street, London, UK',
      link: 'https://maps.google.com',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Mon-Fri: 9am-6pm, Sat: 10am-4pm',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get in touch with {BRAND_NAME}. We're here to help with all your property needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 text-sm">{info.content}</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Contact Form Section */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Info */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Whether you're looking to buy, sell, rent, or need property management services, 
                  our experienced team is ready to assist you. Fill out the form and we'll get back 
                  to you as soon as possible.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Quick Response</h4>
                      <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Expert Advice</h4>
                      <p className="text-sm text-gray-600">Professional guidance from our experienced team</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="border-2 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Map integration available</p>
                    <p className="text-sm text-gray-500 mt-2">Connect Google Maps or similar service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

