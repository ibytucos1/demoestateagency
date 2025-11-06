import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })
config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

const londonProperties = [
  {
    title: 'Modern 3 Bedroom House in Southall',
    slug: 'modern-3-bed-house-southall',
    status: 'active',
    type: 'sale',
    price: 485000,
    currency: 'GBP',
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Terraced house',
    addressLine1: '45 Park Avenue',
    city: 'Southall',
    postcode: 'UB1 3HJ',
    lat: 51.5074,
    lng: -0.3762,
    description: 'A beautifully presented three-bedroom terraced house in the heart of Southall. This property features a spacious reception room with bay windows, a modern fitted kitchen with integrated appliances, and a lovely rear garden. The first floor offers three well-proportioned bedrooms and a contemporary family bathroom. Additional benefits include double glazing, gas central heating, and off-street parking. Perfect for families, close to local schools, shops, and transport links.',
    features: ['Garden', 'Parking', 'Double Glazing', 'Gas Central Heating', 'Modern Kitchen'],
    media: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', alt: 'Modern house exterior', key: 'unsplash-1', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt: 'Living room', key: 'unsplash-2', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', alt: 'Kitchen', key: 'unsplash-3', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Luxury 2 Bed Apartment in Chelsea',
    slug: 'luxury-2-bed-apartment-chelsea',
    status: 'active',
    type: 'sale',
    price: 1250000,
    currency: 'GBP',
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'Apartment',
    addressLine1: 'Riverside House, 28 Chelsea Embankment',
    city: 'Chelsea',
    postcode: 'SW3 4LE',
    lat: 51.4846,
    lng: -0.1679,
    description: 'An exquisite two-bedroom apartment situated in a prestigious riverside development in Chelsea. This stunning property boasts floor-to-ceiling windows offering breathtaking views of the Thames. The open-plan living area features high-end finishes, a state-of-the-art kitchen with premium appliances, and direct access to a private balcony. Both bedrooms are generously sized with en-suite bathrooms. Residents benefit from 24-hour concierge, secure underground parking, and a private gym.',
    features: ['Balcony', 'Concierge', 'Gym', 'River Views', 'Parking', 'Lift'],
    media: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', alt: 'Luxury apartment exterior', key: 'unsplash-4', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', alt: 'Modern living space', key: 'unsplash-5', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt: 'Bedroom', key: 'unsplash-6', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Charming 4 Bed Victorian House in Camden',
    slug: 'charming-4-bed-victorian-camden',
    status: 'active',
    type: 'sale',
    price: 895000,
    currency: 'GBP',
    bedrooms: 4,
    bathrooms: 3,
    propertyType: 'Semi-Detached',
    addressLine1: '67 Primrose Hill Road',
    city: 'Camden',
    postcode: 'NW3 3AE',
    lat: 51.5426,
    lng: -0.1615,
    description: 'A stunning Victorian semi-detached house offering spacious family accommodation over three floors. The property retains many original features including high ceilings, decorative cornicing, and sash windows. The ground floor comprises a elegant reception room, separate dining room, and extended kitchen/breakfast room overlooking the garden. Upstairs are four double bedrooms and three bathrooms. The mature rear garden is approximately 60ft. Located in a sought-after residential area close to Camden amenities.',
    features: ['Period Features', 'Garden', 'Off-Street Parking', 'Extended Kitchen', 'Three Bathrooms'],
    media: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', alt: 'Victorian house', key: 'unsplash-7', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', alt: 'Period living room', key: 'unsplash-8', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa', alt: 'Garden view', key: 'unsplash-9', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Spacious 1 Bed Flat in Canary Wharf',
    slug: 'spacious-1-bed-flat-canary-wharf',
    status: 'active',
    type: 'rent',
    price: 1850,
    currency: 'GBP',
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: 'The Landmark, 24 Marsh Wall',
    city: 'Canary Wharf',
    postcode: 'E14 9TP',
    lat: 51.5045,
    lng: -0.0203,
    description: 'A superb one-bedroom apartment in a prestigious development in the heart of Canary Wharf. This modern property features an open-plan living area with integrated kitchen, a spacious bedroom with built-in wardrobes, and a contemporary bathroom. Floor-to-ceiling windows provide abundant natural light and stunning city views. The development offers excellent facilities including 24-hour concierge, residents gym, and communal gardens. Ideally located for Canary Wharf station and local amenities.',
    features: ['Concierge', 'Gym', 'Furnished', 'Balcony', 'Available Now'],
    media: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', alt: 'Modern apartment', key: 'unsplash-10', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', alt: 'Open plan living', key: 'unsplash-11', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', alt: 'Bedroom view', key: 'unsplash-12', width: 1920, height: 1280 },
    ],
  },
  {
    title: '5 Bedroom Detached House in Hampstead',
    slug: '5-bedroom-detached-hampstead',
    status: 'active',
    type: 'sale',
    price: 2750000,
    currency: 'GBP',
    bedrooms: 5,
    bathrooms: 4,
    propertyType: 'Detached',
    addressLine1: '12 Frognal Lane',
    city: 'Hampstead',
    postcode: 'NW3 7DY',
    lat: 51.5551,
    lng: -0.1804,
    description: 'An exceptional five-bedroom detached family home in one of Hampsteads most prestigious roads. This beautifully presented property extends over 3,500 sq ft and features a magnificent reception hall, three reception rooms, a stunning kitchen/family room with bi-fold doors to the garden, and a separate utility room. The first floor offers a luxurious master suite with dressing room and en-suite, plus three further bedrooms and family bathroom. The top floor provides an additional bedroom/study. The landscaped garden is approximately 80ft.',
    features: ['Garden', 'Driveway', 'Master Suite', 'Study', 'Utility Room', 'High Ceilings'],
    media: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', alt: 'Detached house', key: 'unsplash-13', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4', alt: 'Reception room', key: 'unsplash-14', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', alt: 'Master bedroom', key: 'unsplash-15', width: 1920, height: 1280 },
    ],
  },
  {
    title: '2 Bed Garden Flat in Wimbledon',
    slug: '2-bed-garden-flat-wimbledon',
    status: 'active',
    type: 'rent',
    price: 2100,
    currency: 'GBP',
    bedrooms: 2,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: '89 Ridgway',
    city: 'Wimbledon',
    postcode: 'SW19 4ST',
    lat: 51.4332,
    lng: -0.2086,
    description: 'A delightful two-bedroom garden flat in the heart of Wimbledon Village. This charming property comprises a bright reception room with access to a private patio garden, a separate modern kitchen, two double bedrooms, and a family bathroom. The property has been recently refurbished to a high standard throughout. Ideally situated within walking distance of Wimbledon Village shops, restaurants, and transport links. Available immediately, unfurnished. Sorry no DSS or pets.',
    features: ['Garden', 'Recently Refurbished', 'Village Location', 'Available Now', 'Unfurnished'],
    media: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', alt: 'Garden flat', key: 'unsplash-16', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115', alt: 'Living area', key: 'unsplash-17', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e', alt: 'Garden patio', key: 'unsplash-18', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Contemporary 3 Bed Townhouse in Clapham',
    slug: 'contemporary-3-bed-townhouse-clapham',
    status: 'active',
    type: 'sale',
    price: 725000,
    currency: 'GBP',
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Terraced house',
    addressLine1: '156 Clapham High Street',
    city: 'Clapham',
    postcode: 'SW4 7UG',
    lat: 51.4618,
    lng: -0.1384,
    description: 'A stunning contemporary townhouse arranged over three floors in the heart of Clapham. The ground floor features an open-plan kitchen/dining/living area with sleek integrated appliances and bi-fold doors leading to a private courtyard garden. The first floor offers two double bedrooms and a stylish family bathroom. The top floor houses the impressive master bedroom with en-suite shower room and built-in storage. This property benefits from wooden flooring throughout, underfloor heating, and excellent transport links.',
    features: ['Garden', 'Underfloor Heating', 'Open Plan', 'En-Suite', 'Modern Design'],
    media: [
      { url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6', alt: 'Modern townhouse', key: 'unsplash-19', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', alt: 'Open plan kitchen', key: 'unsplash-20', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea', alt: 'Master suite', key: 'unsplash-21', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Studio Apartment in Shoreditch',
    slug: 'studio-apartment-shoreditch',
    status: 'active',
    type: 'rent',
    price: 1350,
    currency: 'GBP',
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: 'The Electric, 84 Curtain Road',
    city: 'Shoreditch',
    postcode: 'EC2A 3AA',
    lat: 51.5254,
    lng: -0.0807,
    description: 'A stylish studio apartment in a vibrant Shoreditch development. This modern property features an open-plan living space with integrated kitchen, a contemporary bathroom, and ample storage. Large windows provide excellent natural light and views over the city. The building offers excellent amenities including a communal roof terrace, co-working space, and bike storage. Perfectly positioned for Shoreditch High Street station and the areas trendy bars, restaurants, and galleries. Available furnished from December.',
    features: ['Furnished', 'Roof Terrace', 'Co-Working Space', 'Bike Storage', 'Concierge'],
    media: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt: 'Studio apartment', key: 'unsplash-22', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365', alt: 'Modern studio', key: 'unsplash-23', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f', alt: 'Bathroom', key: 'unsplash-24', width: 1920, height: 1280 },
    ],
  },
  {
    title: '4 Bed Semi-Detached in Richmond',
    slug: '4-bed-semi-detached-richmond',
    status: 'active',
    type: 'sale',
    price: 1150000,
    currency: 'GBP',
    bedrooms: 4,
    bathrooms: 2,
    propertyType: 'Semi-Detached',
    addressLine1: '34 Queens Road',
    city: 'Richmond',
    postcode: 'TW10 6JJ',
    lat: 51.4613,
    lng: -0.3037,
    description: 'A beautifully presented four-bedroom Edwardian semi-detached house in a prime Richmond location. This family home features a spacious entrance hall, two reception rooms, a refitted kitchen/breakfast room, and a conservatory overlooking the mature garden. Upstairs comprises four bedrooms and a modern family bathroom. The property benefits from gas central heating, double glazing, off-street parking, and a detached garage. Within walking distance of Richmond town centre, the riverside, and excellent schools.',
    features: ['Garden', 'Garage', 'Parking', 'Conservatory', 'Period Features', 'Near Schools'],
    media: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be', alt: 'Edwardian house', key: 'unsplash-25', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', alt: 'Period reception', key: 'unsplash-26', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', alt: 'Garden and conservatory', key: 'unsplash-27', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Penthouse Apartment in Battersea',
    slug: 'penthouse-apartment-battersea',
    status: 'active',
    type: 'sale',
    price: 1850000,
    currency: 'GBP',
    bedrooms: 3,
    bathrooms: 3,
    propertyType: 'Apartment',
    addressLine1: 'Battersea Power Station, SW8',
    city: 'Battersea',
    postcode: 'SW8 5BN',
    lat: 51.4816,
    lng: -0.1449,
    description: 'An extraordinary three-bedroom penthouse with spectacular panoramic views across London. This exceptional property boasts a vast open-plan living area with designer kitchen, three luxurious en-suite bedrooms, and a private wrap-around terrace of approximately 800 sq ft. Finished to the highest specification with underfloor heating, air conditioning, and premium fixtures throughout. Residents enjoy world-class facilities including concierge, spa, gym, cinema, and riverside gardens. Two secure parking spaces included.',
    features: ['Terrace', 'River Views', 'Parking', 'Concierge', 'Gym', 'Spa', 'Cinema', 'Air Conditioning'],
    media: [
      { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f', alt: 'Penthouse living', key: 'unsplash-28', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', alt: 'Designer kitchen', key: 'unsplash-29', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', alt: 'Terrace views', key: 'unsplash-30', width: 1920, height: 1280 },
    ],
  },
  {
    title: '2 Bed Maisonette in Brixton',
    slug: '2-bed-maisonette-brixton',
    status: 'active',
    type: 'rent',
    price: 1650,
    currency: 'GBP',
    bedrooms: 2,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: '78 Coldharbour Lane',
    city: 'Brixton',
    postcode: 'SW9 8PS',
    lat: 51.4607,
    lng: -0.1163,
    description: 'A charming two-bedroom Victorian maisonette on a popular Brixton street. This property comprises a spacious reception room with period features, a separate modern kitchen, two double bedrooms, and a contemporary bathroom. The maisonette also benefits from a small private garden and wood flooring throughout. Perfectly located for Brixton underground station, local markets, and the vibrant mix of bars, restaurants, and entertainment venues. Available from January, part-furnished.',
    features: ['Garden', 'Period Features', 'Part Furnished', 'Wood Floors', 'Transport Links'],
    media: [
      { url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc', alt: 'Victorian maisonette', key: 'unsplash-31', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1', alt: 'Period living room', key: 'unsplash-32', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566752229-250ed79c0c8c', alt: 'Bedroom', key: 'unsplash-33', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Luxury 4 Bed House in Notting Hill',
    slug: 'luxury-4-bed-house-notting-hill',
    status: 'active',
    type: 'sale',
    price: 3250000,
    currency: 'GBP',
    bedrooms: 4,
    bathrooms: 3,
    propertyType: 'Terraced house',
    addressLine1: '23 Lansdowne Crescent',
    city: 'Notting Hill',
    postcode: 'W11 2NN',
    lat: 51.5142,
    lng: -0.1950,
    description: 'An exquisite four-bedroom house on one of Notting Hills most desirable crescents. This stunning property has been meticulously refurbished to an exceptional standard, combining period elegance with contemporary luxury. The accommodation comprises a grand reception room, formal dining room, state-of-the-art kitchen/family room with garden access, and a study. The first floor offers a magnificent master suite with dressing room and marble bathroom, plus two further bedrooms. The top floor provides a fourth bedroom/playroom. The property also features a beautifully landscaped garden and access to communal gardens.',
    features: ['Garden', 'Communal Gardens', 'Study', 'Master Suite', 'Period Features', 'Prime Location'],
    media: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', alt: 'Luxury townhouse', key: 'unsplash-34', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', alt: 'Reception room', key: 'unsplash-35', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600573472556-e636b61e8a8e', alt: 'Kitchen family room', key: 'unsplash-36', width: 1920, height: 1280 },
    ],
  },
  {
    title: '1 Bed Flat in Kings Cross',
    slug: '1-bed-flat-kings-cross',
    status: 'active',
    type: 'rent',
    price: 1650,
    currency: 'GBP',
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: 'Coal Drops Yard, N1C',
    city: 'Kings Cross',
    postcode: 'N1C 4DQ',
    lat: 51.5352,
    lng: -0.1247,
    description: 'A stylish one-bedroom apartment in the award-winning Kings Cross development. This modern property features an open-plan reception/kitchen with Juliet balcony, a spacious bedroom with fitted wardrobes, and a contemporary bathroom. High-specification finishes throughout include underfloor heating and premium appliances. Residents benefit from 24-hour concierge, communal gardens, and gym. The development is perfectly located for Kings Cross, St Pancras International, and the vibrant restaurants and shops of Coal Drops Yard. Available furnished.',
    features: ['Concierge', 'Gym', 'Furnished', 'Balcony', 'Underfloor Heating', 'Transport Links'],
    media: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', alt: 'Modern apartment', key: 'unsplash-37', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099', alt: 'Open plan living', key: 'unsplash-38', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115', alt: 'Bedroom', key: 'unsplash-39', width: 1920, height: 1280 },
    ],
  },
  {
    title: '3 Bed Bungalow in Chiswick',
    slug: '3-bed-bungalow-chiswick',
    status: 'active',
    type: 'sale',
    price: 875000,
    currency: 'GBP',
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Bungalow',
    addressLine1: '56 Burlington Lane',
    city: 'Chiswick',
    postcode: 'W4 2QE',
    lat: 51.4921,
    lng: -0.2707,
    description: 'A rare opportunity to acquire a three-bedroom detached bungalow in sought-after Chiswick. This property offers flexible single-level living with a spacious entrance hall, bright reception room, modern kitchen/breakfast room, three bedrooms (master with en-suite), and family bathroom. The property sits on a generous plot with front and rear gardens, driveway parking for multiple vehicles, and potential to extend (STPP). Ideally located close to Chiswick High Road, excellent schools, and transport links. Chain free.',
    features: ['Bungalow', 'Detached', 'Garden', 'Parking', 'En-Suite', 'Extension Potential', 'Chain Free'],
    media: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', alt: 'Detached bungalow', key: 'unsplash-40', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', alt: 'Reception room', key: 'unsplash-41', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea', alt: 'Garden', key: 'unsplash-42', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Modern 2 Bed Apartment in Stratford',
    slug: 'modern-2-bed-apartment-stratford',
    status: 'active',
    type: 'rent',
    price: 1550,
    currency: 'GBP',
    bedrooms: 2,
    bathrooms: 1,
    propertyType: 'Apartment',
    addressLine1: 'East Village, E20',
    city: 'Stratford',
    postcode: 'E20 1EJ',
    lat: 51.5448,
    lng: 0.0076,
    description: 'A superb two-bedroom apartment in the vibrant East Village development. This well-proportioned property comprises an open-plan kitchen/living/dining area with access to a private balcony, two double bedrooms with built-in storage, and a modern bathroom. The apartment benefits from integrated appliances, wooden flooring, and excellent natural light. Residents enjoy access to on-site facilities including concierge, gym, communal gardens, and childrens play areas. Ideally situated for Stratford International and Westfield shopping centre. Available immediately, unfurnished.',
    features: ['Balcony', 'Concierge', 'Gym', 'Play Area', 'Unfurnished', 'Transport Links'],
    media: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', alt: 'Modern development', key: 'unsplash-43', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', alt: 'Living area', key: 'unsplash-44', width: 1920, height: 1280 },
      { url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e', alt: 'Bedroom', key: 'unsplash-45', width: 1920, height: 1280 },
    ],
  },
]

async function seedLondonProperties() {
  try {
    console.log('🌱 Starting to seed London properties...')

    // Get tenant
    const tenant = await prisma.tenant.findFirst({
      where: { slug: 'acme' },
    })

    if (!tenant) {
      console.error('❌ Tenant not found. Please run the main seed script first.')
      process.exit(1)
    }

    console.log(`✅ Found tenant: ${tenant.name} (${tenant.id})`)

    // Create properties
    let created = 0
    let skipped = 0

    for (const property of londonProperties) {
      try {
        // Check if property already exists
        const exists = await prisma.listing.findUnique({
          where: {
            tenantId_slug: {
              tenantId: tenant.id,
              slug: property.slug,
            },
          },
        })

        if (exists) {
          console.log(`⏭️  Skipping ${property.title} (already exists)`)
          skipped++
          continue
        }

        // Create property
        await prisma.listing.create({
          data: {
            ...property,
            tenantId: tenant.id,
          },
        })

        console.log(`✅ Created: ${property.title}`)
        created++
      } catch (error) {
        console.error(`❌ Error creating ${property.title}:`, error)
      }
    }

    console.log('\n🎉 Seeding complete!')
    console.log(`✅ Created: ${created}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`📊 Total: ${londonProperties.length}`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedLondonProperties()

