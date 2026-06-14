package com.weatherflow.app.data.remote.api

import com.weatherflow.app.data.remote.dto.CurrentWeatherDto
import com.weatherflow.app.data.remote.dto.WeatherResponseDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter

class WeatherApi(private val client: HttpClient) {

    suspend fun fetchWeather(
        lat: Double,
        lon: Double,
        days: Int = 14,
    ): WeatherResponseDto {
        return client.get("https://api.open-meteo.com/v1/forecast") {
            parameter("latitude", lat)
            parameter("longitude", lon)
            parameter("current", "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,pressure_msl")
            parameter("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max")
            parameter("hourly", "temperature_2m,precipitation_probability,weather_code,relative_humidity_2m,wind_speed_10m,uv_index")
            parameter("timezone", "auto")
            parameter("forecast_days", days)
            parameter("forecast_hours", 24)
        }.body()
    }

    suspend fun fetchCurrentWeather(lat: Double, lon: Double): CurrentWeatherDto {
        val response = fetchWeather(lat, lon)
        return response.current
            ?: throw IllegalStateException("Open-Meteo did not return current weather data")
    }
}
