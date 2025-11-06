import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const propertyTypes = ['house', 'apartment', 'condo', 'villa', 'townhouse']
const features = [
  'parking', 'garden', 'balcony', 'pool', 'gym', 'elevator',
  'fireplace', 'hardwood floors', 'central heating', 'air conditioning',
]

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Antonio']

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('Seeding database...')

  // Create tenants
  const acme = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      id: 'acme-tenant-id',
      slug: 'acme',
      name: 'ACME Real Estate',
      theme: {
        primaryColor: '#3b82f6',
        logo: '/logo-acme.png',
        features: {
          propertyManagement: true,
        },
      },
      whatsappNumber: '+447700900123',
    },
  })

  const bluebird = await prisma.tenant.upsert({
    where: { slug: 'bluebird' },
    update: {},
    create: {
      id: 'bluebird-tenant-id',
      slug: 'bluebird',
      name: 'Bluebird Properties',
      theme: {
        primaryColor: '#10b981',
        logo: '/logo-bluebird.png',
        features: {
          propertyManagement: true,
        },
      },
      whatsappNumber: '+447700900456',
    },
  })

  console.log('Created tenants:', acme.slug, bluebird.slug)

  // Create sample listings for ACME
  const acmeListings = []
  for (let i = 0; i < 12; i++) {
    const type = randomElement(['sale', 'rent'])
    const price = type === 'sale'
      ? randomInt(200000, 2000000)
      : randomInt(1500, 8000)

    const listing = await prisma.listing.create({
      data: {
        tenantId: acme.id,
        slug: `property-${i + 1}`,
        title: `${randomElement(['Beautiful', 'Stunning', 'Luxurious', 'Modern'])} ${randomElement(propertyTypes)} in ${randomElement(cities)}`,
        status: randomElement(['active', 'active', 'active', 'draft', 'sold']),
        type,
        price,
        currency: 'USD',
        bedrooms: randomInt(1, 5),
        bathrooms: randomInt(1, 4),
        propertyType: randomElement(propertyTypes),
        addressLine1: `${randomInt(100, 9999)} ${randomElement(['Main St', 'Oak Ave', 'Park Blvd', 'Maple Dr'])}`,
        city: randomElement(cities),
        postcode: `${randomInt(10000, 99999)}`,
        lat: randomInt(34000, 42000) / 1000, // Approx US latitudes
        lng: -(randomInt(70000, 120000) / 1000), // Approx US longitudes
        description: `This ${randomElement(['stunning', 'beautiful', 'spacious', 'modern'])} property features ${randomInt(1, 4)} bedrooms and ${randomInt(1, 3)} bathrooms. Located in a ${randomElement(['desirable', 'prestigious', 'convenient'])} neighborhood with easy access to ${randomElement(['schools', 'shopping', 'transportation', 'parks'])}.`,
        features: Array.from(new Set([
          ...Array(randomInt(2, 5)).fill(0).map(() => randomElement(features)),
        ])),
        media: [
          {
            key: `https://images.unsplash.com/photo-${1600000000000 + i * 1000000}?w=800&h=600&fit=crop`,
            width: 800,
            height: 600,
            alt: 'Property exterior',
          },
          {
            key: `https://images.unsplash.com/photo-${1600100000000 + i * 1000000}?w=800&h=600&fit=crop`,
            width: 800,
            height: 600,
            alt: 'Living room',
          },
        ],
      },
    })
    acmeListings.push(listing)
  }

  // Create sample listings for Bluebird
  const bluebirdListings = []
  for (let i = 0; i < 15; i++) {
    const type = randomElement(['sale', 'rent'])
    const price = type === 'sale'
      ? randomInt(150000, 1500000)
      : randomInt(1200, 6000)

    const listing = await prisma.listing.create({
      data: {
        tenantId: bluebird.id,
        slug: `property-${i + 1}`,
        title: `${randomElement(['Elegant', 'Cozy', 'Spacious', 'Charming'])} ${randomElement(propertyTypes)} in ${randomElement(cities)}`,
        status: randomElement(['active', 'active', 'active', 'draft']),
        type,
        price,
        currency: 'USD',
        bedrooms: randomInt(1, 4),
        bathrooms: randomInt(1, 3),
        propertyType: randomElement(propertyTypes),
        addressLine1: `${randomInt(100, 9999)} ${randomElement(['Elm St', 'Pine Ave', 'Cedar Ln', 'Birch Way'])}`,
        city: randomElement(cities),
        postcode: `${randomInt(10000, 99999)}`,
        lat: randomInt(34000, 42000) / 1000,
        lng: -(randomInt(70000, 120000) / 1000),
        description: `A ${randomElement(['charming', 'elegant', 'welcoming', 'stylish'])} home with ${randomInt(1, 4)} bedrooms. Perfect for ${randomElement(['families', 'professionals', 'retirees'])} seeking ${randomElement(['comfort', 'convenience', 'luxury', 'value'])}.`,
        features: Array.from(new Set([
          ...Array(randomInt(2, 4)).fill(0).map(() => randomElement(features)),
        ])),
        media: [
          {
            key: `https://images.unsplash.com/photo-${1600200000000 + i * 1000000}?w=800&h=600&fit=crop`,
            width: 800,
            height: 600,
            alt: 'Property exterior',
          },
        ],
      },
    })
    bluebirdListings.push(listing)
  }

  console.log(`Created ${acmeListings.length} listings for ACME`)
  console.log(`Created ${bluebirdListings.length} listings for Bluebird`)

  // Seed property management data for ACME
  const acmeProperty = await prisma.property.upsert({
    where: {
      tenantId_code: {
        tenantId: acme.id,
        code: 'ACME-HQ',
      },
    },
    update: {},
    create: {
      tenantId: acme.id,
      name: 'ACME Residences',
      code: 'ACME-HQ',
      description: 'Downtown mixed-use building managed by ACME.',
      addressLine1: '123 Market Street',
      city: 'New York',
      postcode: '10001',
      country: 'USA',
      lat: 40.7538,
      lng: -73.9976,
      ownerName: 'ACME Holdings LLC',
      ownerEmail: 'owners@acme.co',
      metadata: {
        featureFlag: true,
      },
    },
    include: {
      Units: true,
    },
  })

  const unitLabels = ['1A', '1B', '2A']
  const units = []
  for (const label of unitLabels) {
    const unit = await prisma.unit.upsert({
      where: {
        tenantId_propertyId_label: {
          tenantId: acme.id,
          propertyId: acmeProperty.id,
          label,
        },
      },
      update: {},
      create: {
        tenantId: acme.id,
        propertyId: acmeProperty.id,
        label,
        bedrooms: randomInt(1, 3),
        bathrooms: randomInt(1, 2),
        squareFeet: randomInt(600, 1200),
        rentAmount: new Prisma.Decimal(randomInt(2000, 4000)),
        deposit: new Prisma.Decimal(randomInt(2000, 4000)),
        availableFrom: new Date(),
      },
    })
    units.push(unit)
  }

  const tenantProfile = await prisma.tenantProfile.upsert({
    where: {
      tenantId_externalId: {
        tenantId: acme.id,
        externalId: 'tenant-john-doe',
      },
    },
    update: {},
    create: {
      tenantId: acme.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+15550001111',
      externalId: 'tenant-john-doe',
    },
  })

  const lease = await prisma.lease.upsert({
    where: {
      tenantId_externalId: {
        tenantId: acme.id,
        externalId: 'lease-1A-2024',
      },
    },
    update: {},
    create: {
      tenantId: acme.id,
      unitId: units[0]?.id ?? acmeProperty.Units[0]?.id!,
      tenantProfileId: tenantProfile.id,
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 11, 31),
      rentAmount: new Prisma.Decimal(3200),
      depositAmount: new Prisma.Decimal(3200),
      status: 'ACTIVE',
      billingInterval: 'MONTHLY',
      externalId: 'lease-1A-2024',
    },
  })

  await prisma.payment.createMany({
    data: Array.from({ length: 3 }).map((_, index) => ({
      tenantId: acme.id,
      leaseId: lease.id,
      dueDate: new Date(new Date().getFullYear(), index, 1),
      amountDue: new Prisma.Decimal(3200),
      amountPaid: index === 0 ? new Prisma.Decimal(3200) : null,
      paidAt: index === 0 ? new Date(new Date().getFullYear(), index, 3) : null,
      status: index === 0 ? 'PAID' : 'PENDING',
      method: index === 0 ? 'manual' : null,
    })),
    skipDuplicates: true,
  })

  await prisma.maintenanceRequest.upsert({
    where: {
      tenantId_externalId: {
        tenantId: acme.id,
        externalId: 'maint-1A-heat',
      },
    },
    update: {},
    create: {
      tenantId: acme.id,
      propertyId: acmeProperty.id,
      unitId: units[0]?.id ?? null,
      tenantProfileId: tenantProfile.id,
      summary: 'Heating not working',
      description: 'Tenant reported that the heating system stopped working on the 3rd floor.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedAgentId: 'agent-123',
      externalId: 'maint-1A-heat',
    },
  })

  // Note: Users should be created via Clerk and then synced to DB
  // For demo, we'll just log a note
  console.log('Note: Create users via Clerk dashboard and sync to database manually')
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

