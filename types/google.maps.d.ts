declare global {
  namespace google {
    namespace maps {
      interface LatLngLiteral {
        lat: number
        lng: number
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral
        zoom?: number
        mapTypeControl?: boolean
        streetViewControl?: boolean
        fullscreenControl?: boolean
        mapId?: string
      }

      class LatLng {
        constructor(lat: number, lng: number)
        lat(): number
        lng(): number
      }

      class LatLngBounds {
        constructor()
        extend(latLng: LatLng): void
        getCenter(): LatLng
      }

      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions)
        fitBounds(bounds: LatLngBounds): void
      }

      class InfoWindow {
        constructor(options?: { content?: string })
        setContent(content: string): void
        open(map?: Map, anchor?: marker.AdvancedMarkerElement): void
        close(): void
      }

      namespace marker {
        interface PinElementOptions {
          background?: string
          borderColor?: string
          glyphColor?: string
        }

        class PinElement {
          constructor(options?: PinElementOptions)
          element: HTMLElement
        }

        interface AdvancedMarkerElementOptions {
          position: LatLngLiteral
          map?: Map | null
          title?: string
          content?: HTMLElement
        }

        class AdvancedMarkerElement {
          constructor(options: AdvancedMarkerElementOptions)
          map: Map | null
          addListener(event: string, handler: (...args: unknown[]) => void): void
        }
      }
    }
  }

  interface Window {
    google?: typeof google
  }
}

export {}

