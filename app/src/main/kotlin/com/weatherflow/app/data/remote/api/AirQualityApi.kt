package com.weatherflow.app.data.remote.api

import com.weatherflow.app.data.remote.dto.AirQualityDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter

class AirQualityApi(private val client: HttpClient) {

    suspend fun fetchAirQuality(lat: Double, lon: Double): AirQualityDto {
        return client.get("https://air-quality-api.open-meteo.com/v1/air-quality") {
            parameter("latitude", lat)
            parameter("longitude", lon)
            parameter("current", "european_aqi,us_aqi,pm2_5,pm10,ozone")
        }.body()
    }
}
