"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in production build
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface ViewLocation {
  id: number
  lat: number
  lng: number
  views: number
}

export function ViewsMap({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [viewLocations, setViewLocations] = useState<ViewLocation[]>([])

  useEffect(() => {
    // Simulating an API call to fetch view locations
    const fetchViewLocations = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setViewLocations([
        { id: 1, lat: 40.7128, lng: -74.0060, views: 1500 }, // New York
        { id: 2, lat: 51.5074, lng: -0.1278, views: 1200 },  // London
        { id: 3, lat: 35.6762, lng: 139.6503, views: 1000 }, // Tokyo
        { id: 4, lat: -33.8688, lng: 151.2093, views: 800 }, // Sydney
      ])
    }

    fetchViewLocations()
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Views Map</CardTitle>
        <CardDescription>Geographic distribution of document views</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {viewLocations.map((location) => (
              <Marker key={location.id} position={[location.lat, location.lng]}>
                <Popup>
                  Views: {location.views}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

