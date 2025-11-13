import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const propertyTypes = ['house', 'apartment', 'flat', 'terraced', 'semi-detached', 'detached', 'bungalow']
const features = [
  'parking', 'garden', 'balcony', 'garage', 'double-glazing',
  'fireplace', 'period-features', 'central heating', 'modern', 'character',
]

// Real UK locations with coordinates (lat, lng)
const ukLocations = [
  { city: 'Hayes', postcode: 'UB3', lat: 51.5031, lng: -0.4203 },
  { city: 'Southall', postcode: 'UB1', lat: 51.5060, lng: -0.3772 },
  { city: 'Ealing', postcode: 'W5', lat: 51.5150, lng: -0.3018 },
  { city: 'Hounslow', postcode: 'TW3', lat: 51.4659, lng: -0.3615 },
  { city: 'Uxbridge', postcode: 'UB8', lat: 51.5448, lng: -0.4762 },
  { city: 'Slough', postcode: 'SL1', lat: 51.5105, lng: -0.5950 },
  { city: 'Reading', postcode: 'RG1', lat: 51.4543, lng: -0.9781 },
  { city: 'Maidenhead', postcode: 'SL6', lat: 51.5224, lng: -0.7224 },
  { city: 'Windsor', postcode: 'SL4', lat: 51.4839, lng: -0.6078 },
  { city: 'Richmond', postcode: 'TW9', lat: 51.4613, lng: -0.3037 },
  { city: 'Kingston upon Thames', postcode: 'KT1', lat: 51.4123, lng: -0.3007 },
  { city: 'Twickenham', postcode: 'TW1', lat: 51.4447, lng: -0.3370 },
  { city: 'Fulham', postcode: 'SW6', lat: 51.4800, lng: -0.1950 },
  { city: 'Hammersmith', postcode: 'W6', lat: 51.4926, lng: -0.2229 },
  { city: 'Chiswick', postcode: 'W4', lat: 51.4921, lng: -0.2558 },
]

const ukStreets = [
  'High Street', 'Church Road', 'Station Road', 'Park Road', 'Victoria Road',
  'London Road', 'Main Road', 'Green Lane', 'Oak Avenue', 'Elm Close',
  'Cedar Drive', 'Maple Way', 'Willow Road', 'Beech Street', 'Ash Grove',
]

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomUKPostcode(area: string): string {
  // Generate a realistic UK postcode format: Area + random numbers + letters
  const numbers = randomInt(1, 9).toString() + randomInt(0, 9).toString()
  const letters = String.fromCharCode(65 + randomInt(0, 25)) + String.fromCharCode(65 + randomInt(0, 25))
  return `${area} ${numbers} ${letters}`
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
      contactPhone: '+442071234567',
      contactEmail: 'info@acmerealestate.com',
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
      contactPhone: '+442079876543',
      contactEmail: 'contact@bluebirdproperties.co.uk',
    },
  })

  console.log('Created tenants:', acme.slug, bluebird.slug)

  // Create sample listings for ACME with UK locations
  const acmeListings = []
  for (let i = 0; i < 20; i++) {
    const location = randomElement(ukLocations)
    const type = randomElement(['sale', 'rent'])
    const price = type === 'sale'
      ? randomInt(250000, 1200000) // UK house prices
      : randomInt(1200, 3500) // UK rent prices per month
    
    const bedrooms = randomInt(1, 5)
    const bathrooms = randomInt(1, 3)
    const propertyType = randomElement(propertyTypes)

    const listing = await prisma.listing.create({
      data: {
        tenantId: acme.id,
        slug: `${location.city.toLowerCase().replace(/\s+/g, '-')}-${propertyType}-${i + 1}-${acme.id.slice(0, 8)}`,
        title: `${randomElement(['Beautiful', 'Stunning', 'Luxurious', 'Modern', 'Spacious', 'Charming'])} ${bedrooms}-Bedroom ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${location.city}`,
        status: randomElement(['active', 'active', 'active', 'draft', 'sold']),
        type,
        price,
        currency: 'GBP',
        bedrooms,
        bathrooms,
        propertyType,
        addressLine1: `${randomInt(1, 199)} ${randomElement(ukStreets)}`,
        city: location.city,
        postcode: randomUKPostcode(location.postcode),
        lat: location.lat + (Math.random() - 0.5) * 0.01, // Small variation around location
        lng: location.lng + (Math.random() - 0.5) * 0.01,
        description: `This ${randomElement(['stunning', 'beautiful', 'spacious', 'modern', 'well-presented'])} ${bedrooms}-bedroom ${propertyType} is located in the ${randomElement(['desirable', 'popular', 'convenient', 'sought-after'])} area of ${location.city}. The property features ${bathrooms} ${bathrooms === 1 ? 'bathroom' : 'bathrooms'} and is within easy reach of ${randomElement(['local amenities', 'transport links', 'excellent schools', 'shopping centres', 'parks and green spaces'])}.`,
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

  // Create sample listings for Bluebird with UK locations
  const bluebirdListings = []
  for (let i = 0; i < 18; i++) {
    const location = randomElement(ukLocations)
    const type = randomElement(['sale', 'rent'])
    const price = type === 'sale'
      ? randomInt(200000, 1000000) // UK house prices
      : randomInt(1000, 3000) // UK rent prices per month
    
    const bedrooms = randomInt(1, 4)
    const bathrooms = randomInt(1, 3)
    const propertyType = randomElement(propertyTypes)

    const listing = await prisma.listing.create({
      data: {
        tenantId: bluebird.id,
        slug: `${location.city.toLowerCase().replace(/\s+/g, '-')}-${propertyType}-${i + 1}-${bluebird.id.slice(0, 8)}`,
        title: `${randomElement(['Elegant', 'Cozy', 'Spacious', 'Charming', 'Well-Maintained'])} ${bedrooms}-Bedroom ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${location.city}`,
        status: randomElement(['active', 'active', 'active', 'draft']),
        type,
        price,
        currency: 'GBP',
        bedrooms,
        bathrooms,
        propertyType,
        addressLine1: `${randomInt(1, 199)} ${randomElement(ukStreets)}`,
        city: location.city,
        postcode: randomUKPostcode(location.postcode),
        lat: location.lat + (Math.random() - 0.5) * 0.01, // Small variation around location
        lng: location.lng + (Math.random() - 0.5) * 0.01,
        description: `A ${randomElement(['charming', 'elegant', 'welcoming', 'stylish', 'well-appointed'])} ${bedrooms}-bedroom ${propertyType} situated in ${location.city}. This property offers ${bathrooms} ${bathrooms === 1 ? 'bathroom' : 'bathrooms'} and is ideal for ${randomElement(['families', 'professionals', 'first-time buyers', 'investors'])} looking for ${randomElement(['comfort', 'convenience', 'value', 'a great location'])}.`,
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

  // Seed property management data for ACME (UK location)
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
      description: 'Modern residential building managed by ACME in Hayes.',
      addressLine1: '45 High Street',
      city: 'Hayes',
      postcode: 'UB3 1AB',
      country: 'UK',
      lat: 51.5031,
      lng: -0.4203,
      ownerName: 'ACME Holdings Ltd',
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

