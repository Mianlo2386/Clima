package com.weatherflow.app.data.remote.api

import com.weatherflow.app.data.remote.dto.GeocodingDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter

class GeocodingApi(private val client: HttpClient) {

    suspend fun search(query: String, count: Int = 5): GeocodingDto {
        return client.get("https://geocoding-api.open-meteo.com/v1/search") {
            parameter("name", query)
            parameter("count", count)
            parameter("language", "es")
            parameter("format", "json")
        }.body()
    }

    suspend fun reverse(lat: Double, lon: Double): GeocodingDto {
        return client.get("https://geocoding-api.open-meteo.com/v1/reverse") {
            parameter("latitude", lat)
            parameter("longitude", lon)
            parameter("language", "es")
            parameter("format", "json")
        }.body()
    }
}
