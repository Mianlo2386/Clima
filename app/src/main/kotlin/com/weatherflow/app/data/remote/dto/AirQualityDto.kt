package com.weatherflow.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AirQualityCurrentDto(
    @SerialName("european_aqi") val europeanAqi: Int? = null,
    @SerialName("us_aqi") val usAqi: Int? = null,
    @SerialName("pm2_5") val pm25: Double? = null,
    val pm10: Double? = null,
    val ozone: Double? = null,
)

@Serializable
data class AirQualityDto(
    val current: AirQualityCurrentDto? = null,
)
