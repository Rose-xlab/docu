"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

const MapWithNoSSR = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px]" />
})

interface ViewLocation {
  id: number
  lat: number
  lng: number
  views: number
  country: string
}

interface ViewsMapProps extends React.HTMLAttributes<HTMLDivElement> {
  viewLocations?: ViewLocation[]
}

export function ViewsMap({ className, viewLocations: initialLocations }: ViewsMapProps) {
  const [viewLocations, setViewLocations] = useState<ViewLocation[]>(initialLocations || [])

  useEffect(() => {
    if (!initialLocations) {
      setViewLocations([
        { id: 1, lat: 40.7128, lng: -74.0060, views: 1500, country: 'USA' },
        { id: 2, lat: 51.5074, lng: -0.1278, views: 1200, country: 'UK' },
        { id: 3, lat: 35.6762, lng: 139.6503, views: 1000, country: 'Japan' },
        { id: 4, lat: -33.8688, lng: 151.2093, views: 800, country: 'Australia' },
      ])
    }
  }, [initialLocations])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Views Map</CardTitle>
        <CardDescription>Geographic distribution of document views</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <MapWithNoSSR locations={viewLocations} />
        </div>
      </CardContent>
    </Card>
  )
}