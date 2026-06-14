package com.weatherflow.app.domain.model

data class AirQuality(
    val europeanAqi: Int?,
    val usAqi: Int?,
    val pm25: Double?,
    val pm10: Double?,
    val ozone: Double?,
)
