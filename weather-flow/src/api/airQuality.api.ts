interface AirQualityResponse {
  current: {
    european_aqi: number | null
    us_aqi: number | null
    pm2_5: number | null
    pm10: number | null
    ozone: number | null
  }
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'european_aqi,us_aqi,pm2_5,pm10,ozone',
  })

  const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`)
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`)
  return res.json()
}
