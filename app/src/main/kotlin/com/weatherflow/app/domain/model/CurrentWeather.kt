package com.weatherflow.app.domain.model

data class CurrentWeather(
    val temperature: Double,
    val feelsLike: Double,
    val condition: WeatherCondition,
    val humidity: Int,
    val windSpeed: Double,
    val pressure: Double,
    val precipitation: Double,
    val timestamp: Long,
)
