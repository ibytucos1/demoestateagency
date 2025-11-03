import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const title = searchParams.get('title') || 'Property Listing'
  const price = searchParams.get('price') || ''
  const address = searchParams.get('address') || ''

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
          {title}
        </div>
        {price ? (
          <div style={{ fontSize: 48, marginBottom: 20 }}>
            ${price}
          </div>
        ) : null}
        {address ? (
          <div style={{ fontSize: 32, opacity: 0.9 }}>
            {address}
          </div>
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

