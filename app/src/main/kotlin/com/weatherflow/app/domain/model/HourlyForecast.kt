package com.weatherflow.app.domain.model

data class HourlyForecast(
    val time: String,
    val temperature: Double,
    val condition: WeatherCondition,
    val precipitationProbability: Int,
    val humidity: Int,
    val windSpeed: Double,
    val uvIndex: Double,
)
