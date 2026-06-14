package com.weatherflow.app.data.remote.api

import com.weatherflow.app.data.remote.dto.WeatherAlertDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter

class AlertApi(private val client: HttpClient) {

    suspend fun fetchAlerts(lat: Double, lon: Double): WeatherAlertDto {
        return client.get("https://api.open-meteo.com/v1/weather-alerts") {
            parameter("latitude", lat)
            parameter("longitude", lon)
        }.body()
    }
}
