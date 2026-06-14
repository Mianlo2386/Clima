package com.weatherflow.app.domain.model

data class DailyForecast(
    val date: String,
    val tempMax: Double,
    val tempMin: Double,
    val condition: WeatherCondition,
    val precipitation: Double,
    val windSpeed: Double,
    val uvIndex: Double,
    val sunrise: String,
    val sunset: String,
)
