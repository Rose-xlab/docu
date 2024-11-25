"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Integration {
  id: string
  name: string
  description: string
  enabled: boolean
}

const integrations: Integration[] = [
  { id: "1", name: "Google Drive", description: "Connect and sync with Google Drive", enabled: true },
  { id: "2", name: "Dropbox", description: "Integrate with Dropbox for cloud storage", enabled: false },
  { id: "3", name: "DocuSign", description: "Enable e-signatures with DocuSign", enabled: true },
  { id: "4", name: "Slack", description: "Share documents and notifications via Slack", enabled: false },
]

export function ThirdPartyIntegrations() {
  const [enabledIntegrations, setEnabledIntegrations] = useState(
    integrations.reduce((acc, integration) => ({ ...acc, [integration.id]: integration.enabled }), {})
  )

  const handleToggleIntegration = (integrationId: string) => {
    setEnabledIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId as keyof typeof prev]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Third-Party Integrations</CardTitle>
        <CardDescription>Manage integrations with external services</CardDescription>
      </CardHeader>
      <CardContent>
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor={`integration-${integration.id}`}>{integration.name}</Label>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </div>
            <Switch
              id={`integration-${integration.id}`}
              checked={enabledIntegrations[integration.id as keyof typeof enabledIntegrations]}
              onCheckedChange={() => handleToggleIntegration(integration.id)}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button>Save Integration Settings</Button>
      </CardFooter>
    </Card>
  )
}

