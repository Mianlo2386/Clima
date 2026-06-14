package com.weatherflow.app.data.remote.dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject

@Serializable
data class WeatherResponseDto(
    val latitude: Double,
    val longitude: Double,
    val timezone: String,
    val current: CurrentWeatherDto? = null,
    val daily: JsonObject? = null,
    val hourly: JsonObject? = null,
)
