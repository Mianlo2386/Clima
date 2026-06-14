interface AlertFeature {
  properties: {
    event: string
    headline: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    effective: string
    expires: string
  }
}

interface AlertsResponse {
  features: AlertFeature[]
}

export async function fetchAlerts(lat: number, lon: number): Promise<AlertsResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
  })

  const res = await fetch(`https://api.open-meteo.com/v1/weather-alerts?${params}`)
  if (!res.ok) throw new Error(`Alerts API error: ${res.status}`)
  return res.json()
}
