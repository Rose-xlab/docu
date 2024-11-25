"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('../map-component'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] rounded-lg bg-gray-100 animate-pulse" />
})