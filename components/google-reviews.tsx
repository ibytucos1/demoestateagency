'use client'

import { Star } from 'lucide-react'

interface Review {
  id: string
  name: string
  rating: number
  date: string
  text: string
  verified?: boolean
}

const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    text: 'Excellent service! The team at Clicksmove helped us find our dream home in just a few weeks. Professional, responsive, and made the entire process stress-free.',
    verified: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 5,
    date: '1 month ago',
    text: 'Outstanding experience from start to finish. The search functionality is intuitive and the property listings are accurate. Highly recommend!',
    verified: true,
  },
  {
    id: '3',
    name: 'Emma Williams',
    rating: 5,
    date: '3 weeks ago',
    text: 'Found the perfect rental property through Clicksmove. The website is easy to navigate and the customer support was incredibly helpful throughout.',
    verified: true,
  },
  {
    id: '4',
    name: 'David Thompson',
    rating: 5,
    date: '1 week ago',
    text: 'Great platform with detailed property information. The virtual tours and high-quality photos made it easy to shortlist properties before viewing.',
    verified: true,
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    rating: 5,
    date: '2 months ago',
    text: 'Professional and reliable service. The team provided excellent guidance and support throughout our property search. Couldn\'t be happier!',
    verified: true,
  },
  {
    id: '6',
    name: 'James Wilson',
    rating: 5,
    date: '3 weeks ago',
    text: 'Fantastic experience! The property search filters are excellent and helped us find exactly what we were looking for. Highly satisfied!',
    verified: true,
  },
]

export function GoogleReviews() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Trusted by Homebuyers, Loved by Movers
          </h2>
          <p className="text-lg text-gray-600">
            See why thousands are making their next move with Clicksmove.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {review.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      {review.verified && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Google Logo */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium">Google Reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}

