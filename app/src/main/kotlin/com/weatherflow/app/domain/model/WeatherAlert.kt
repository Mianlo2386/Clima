package com.weatherflow.app.domain.model

data class WeatherAlert(
    val headline: String,
    val description: String,
    val severity: String,
    val start: Long,
    val end: Long,
)
