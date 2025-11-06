/**
 * Add London properties via the API endpoint
 * This bypasses direct database connection issues
 */

const properties = [
  {
    title: 'Modern 3 Bedroom House in Southall',
    slug: 'modern-3-bed-house-southall-' + Date.now(),
    status: 'active',
    type: 'sale',
    price: 485000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Terraced house',
    addressLine1: '45 Park Avenue',
    city: 'Southall',
    postcode: 'UB1 3HJ',
    description: 'A beautifully presented three-bedroom terraced house in the heart of Southall.',
    features: ['Garden', 'Parking', 'Double Glazing'],
  },
  {
    title: 'Luxury 2 Bed Apartment in Chelsea',
    slug: 'luxury-2-bed-apartment-chelsea-' + Date.now(),
    status: 'active',
    type: 'sale',
    price: 1250000,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'Apartment',
    addressLine1: 'Riverside House, 28 Chelsea Embankment',
    city: 'Chelsea',
    postcode: 'SW3 4LE',
    description: 'An exquisite two-bedroom apartment in a prestigious riverside development.',
    features: ['Balcony', 'Concierge', 'Gym', 'River Views'],
  },
]

async function addPropertiesViaAPI() {
  console.log('🌱 Adding properties via API...\n')

  for (const property of properties) {
    try {
      const response = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant': 'acme',
        },
        body: JSON.stringify(property),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Created: ${property.title} (${data.id})`)
      } else {
        const error = await response.text()
        console.error(`❌ Failed: ${property.title}`, error)
      }
    } catch (error) {
      console.error(`❌ Error: ${property.title}`, error)
    }
  }

  console.log('\n🎉 Done!')
}

addPropertiesViaAPI()

