package com.weatherflow.app.data.repository

import com.weatherflow.app.data.local.CacheManager
import com.weatherflow.app.data.remote.api.AirQualityApi
import com.weatherflow.app.data.remote.api.AlertApi
import com.weatherflow.app.data.remote.api.WeatherApi
import com.weatherflow.app.data.remote.dto.AirQualityDto
import com.weatherflow.app.data.remote.dto.CurrentWeatherDto
import com.weatherflow.app.data.remote.mapper.WeatherMapper
import com.weatherflow.app.domain.model.AirQuality
import com.weatherflow.app.domain.model.CurrentWeather
import com.weatherflow.app.domain.model.DailyForecast
import com.weatherflow.app.domain.model.HourlyForecast
import com.weatherflow.app.domain.model.WeatherAlert
import com.weatherflow.app.domain.repository.WeatherRepository
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.decodeFromJsonElement
import kotlinx.serialization.json.jsonObject

class WeatherRepositoryImpl(
    private val weatherApi: WeatherApi,
    private val airQualityApi: AirQualityApi,
    private val alertApi: AlertApi,
    private val cacheManager: CacheManager,
) : WeatherRepository {

    private val json = Json { ignoreUnknownKeys = true; coerceInputValues = true }

    override suspend fun getCurrentWeather(lat: Double, lon: Double): Result<CurrentWeather> {
        return runCatching {
            val cacheKey = "current_${lat}_${lon}"
            val cached = cacheManager.getCached(cacheKey)
            if (cached != null && !cached.isStale) {
                val dto = json.decodeFromString<CurrentWeatherDto>(cached.data)
                return@runCatching WeatherMapper.toCurrentWeather(dto)
            }

            val response = weatherApi.fetchCurrentWeather(lat, lon)
            val domain = WeatherMapper.toCurrentWeather(response)

            val serialized = json.encodeToString(CurrentWeatherDto.serializer(), response)
            cacheManager.set(cacheKey, json.parseToJsonElement(serialized).jsonObject, CacheManager.TTL_CURRENT)

            domain
        }
    }

    override suspend fun getDailyForecast(lat: Double, lon: Double, days: Int): Result<List<DailyForecast>> {
        return runCatching {
            val cacheKey = "daily_${lat}_${lon}_$days"
            val cached = cacheManager.getCached(cacheKey)
            if (cached != null && !cached.isStale) {
                val dailyObj = json.decodeFromString<JsonObject>(cached.data)
                return@runCatching WeatherMapper.toDailyForecastList(dailyObj)
            }

            val response = weatherApi.fetchWeather(lat, lon, days)
            val daily = response.daily ?: return@runCatching emptyList()
            val domain = WeatherMapper.toDailyForecastList(daily)

            cacheManager.set(cacheKey, daily, CacheManager.TTL_DAILY)
            domain
        }
    }

    override suspend fun getHourlyForecast(lat: Double, lon: Double, hours: Int): Result<List<HourlyForecast>> {
        return runCatching {
            val cacheKey = "hourly_${lat}_${lon}_$hours"
            val cached = cacheManager.getCached(cacheKey)
            if (cached != null && !cached.isStale) {
                val hourlyObj = json.decodeFromString<JsonObject>(cached.data)
                return@runCatching WeatherMapper.toHourlyForecastList(hourlyObj)
            }

            val response = weatherApi.fetchWeather(lat, lon)
            val hourly = response.hourly ?: return@runCatching emptyList()
            val domain = WeatherMapper.toHourlyForecastList(hourly)

            cacheManager.set(cacheKey, hourly, CacheManager.TTL_HOURLY)
            domain
        }
    }

    override suspend fun getAirQuality(lat: Double, lon: Double): Result<AirQuality> {
        return runCatching {
            val cacheKey = "aqi_${lat}_${lon}"
            val cached = cacheManager.getCached(cacheKey)
            if (cached != null && !cached.isStale) {
                val dto = json.decodeFromString<AirQualityDto>(cached.data)
                return@runCatching WeatherMapper.toAirQuality(dto)
            }

            val response = airQualityApi.fetchAirQuality(lat, lon)
            val domain = WeatherMapper.toAirQuality(response)

            val serialized = json.encodeToString(AirQualityDto.serializer(), response)
            cacheManager.set(cacheKey, json.parseToJsonElement(serialized).jsonObject, CacheManager.TTL_AIR_QUALITY)

            domain
        }
    }

    override suspend fun getWeatherAlerts(lat: Double, lon: Double): Result<List<WeatherAlert>> {
        return runCatching {
            val response = alertApi.fetchAlerts(lat, lon)
            WeatherMapper.toWeatherAlerts(response)
        }
    }
}
