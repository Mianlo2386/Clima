package com.weatherflow.app.domain.repository

import com.weatherflow.app.domain.model.AirQuality
import com.weatherflow.app.domain.model.CurrentWeather
import com.weatherflow.app.domain.model.DailyForecast
import com.weatherflow.app.domain.model.HourlyForecast
import com.weatherflow.app.domain.model.WeatherAlert

interface WeatherRepository {
    suspend fun getCurrentWeather(lat: Double, lon: Double): Result<CurrentWeather>
    suspend fun getDailyForecast(lat: Double, lon: Double, days: Int = 14): Result<List<DailyForecast>>
    suspend fun getHourlyForecast(lat: Double, lon: Double, hours: Int = 24): Result<List<HourlyForecast>>
    suspend fun getAirQuality(lat: Double, lon: Double): Result<AirQuality>
    suspend fun getWeatherAlerts(lat: Double, lon: Double): Result<List<WeatherAlert>>
}
