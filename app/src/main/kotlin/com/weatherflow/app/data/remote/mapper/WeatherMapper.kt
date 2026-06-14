package com.weatherflow.app.data.remote.mapper

import com.weatherflow.app.data.remote.dto.AirQualityDto
import com.weatherflow.app.data.remote.dto.CurrentWeatherDto
import com.weatherflow.app.data.remote.dto.WeatherAlertDto
import com.weatherflow.app.data.remote.dto.WeatherResponseDto
import com.weatherflow.app.domain.model.AirQuality
import com.weatherflow.app.domain.model.CurrentWeather
import com.weatherflow.app.domain.model.DailyForecast
import com.weatherflow.app.domain.model.HourlyForecast
import com.weatherflow.app.domain.model.WeatherAlert
import com.weatherflow.app.domain.model.WeatherCondition
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.double
import kotlinx.serialization.json.int
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.time.Instant

object WeatherMapper {

    fun toCurrentWeather(dto: CurrentWeatherDto): CurrentWeather {
        return CurrentWeather(
            temperature = dto.temperature,
            feelsLike = dto.feelsLike,
            condition = WeatherCondition.fromWmo(dto.weatherCode),
            humidity = dto.humidity,
            windSpeed = dto.windSpeed,
            pressure = dto.pressure,
            precipitation = dto.precipitation,
            timestamp = parseIsoToTimestamp(dto.time),
        )
    }

    fun toDailyForecastList(daily: JsonObject): List<DailyForecast> {
        val times = daily.jsonArray("time") ?: return emptyList()
        val weatherCodes = daily.jsonArray("weather_code") ?: return emptyList()
        val tempMax = daily.jsonArray("temperature_2m_max") ?: return emptyList()
        val tempMin = daily.jsonArray("temperature_2m_min") ?: return emptyList()
        val precip = daily.jsonArray("precipitation_sum") ?: return emptyList()
        val wind = daily.jsonArray("wind_speed_10m_max") ?: return emptyList()
        val uv = daily.jsonArray("uv_index_max") ?: return emptyList()
        val sunrise = daily.jsonArray("sunrise") ?: return emptyList()
        val sunset = daily.jsonArray("sunset") ?: return emptyList()

        val size = minOf(
            times.size, weatherCodes.size, tempMax.size, tempMin.size,
            precip.size, wind.size, uv.size, sunrise.size, sunset.size,
        )

        return (0 until size).map { i ->
            DailyForecast(
                date = times[i].jsonPrimitive.content.take(10),
                tempMax = tempMax[i].jsonPrimitive.double,
                tempMin = tempMin[i].jsonPrimitive.double,
                condition = WeatherCondition.fromWmo(weatherCodes[i].jsonPrimitive.int),
                precipitation = precip[i].jsonPrimitive.double,
                windSpeed = wind[i].jsonPrimitive.double,
                uvIndex = uv[i].jsonPrimitive.double,
                sunrise = sunrise[i].jsonPrimitive.content,
                sunset = sunset[i].jsonPrimitive.content,
            )
        }
    }

    fun toHourlyForecastList(hourly: JsonObject): List<HourlyForecast> {
        val times = hourly.jsonArray("time") ?: return emptyList()
        val temps = hourly.jsonArray("temperature_2m") ?: return emptyList()
        val precipProbs = hourly.jsonArray("precipitation_probability") ?: return emptyList()
        val weatherCodes = hourly.jsonArray("weather_code") ?: return emptyList()
        val humidity = hourly.jsonArray("relative_humidity_2m") ?: return emptyList()
        val wind = hourly.jsonArray("wind_speed_10m") ?: return emptyList()
        val uv = hourly.jsonArray("uv_index") ?: return emptyList()

        val size = minOf(
            times.size, temps.size, precipProbs.size,
            weatherCodes.size, humidity.size, wind.size, uv.size,
        )

        return (0 until size).map { i ->
            HourlyForecast(
                time = times[i].jsonPrimitive.content,
                temperature = temps[i].jsonPrimitive.double,
                condition = WeatherCondition.fromWmo(weatherCodes[i].jsonPrimitive.int),
                precipitationProbability = precipProbs[i].jsonPrimitive.int,
                humidity = humidity[i].jsonPrimitive.int,
                windSpeed = wind[i].jsonPrimitive.double,
                uvIndex = uv[i].jsonPrimitive.double,
            )
        }
    }

    fun toAirQuality(dto: AirQualityDto): AirQuality {
        val current = dto.current
        return AirQuality(
            europeanAqi = current?.europeanAqi,
            usAqi = current?.usAqi,
            pm25 = current?.pm25,
            pm10 = current?.pm10,
            ozone = current?.ozone,
        )
    }

    fun toWeatherAlerts(dto: WeatherAlertDto): List<WeatherAlert> {
        return dto.features.mapNotNull { feature ->
            val props = feature.properties ?: return@mapNotNull null
            WeatherAlert(
                headline = props.headline ?: return@mapNotNull null,
                description = props.description ?: "",
                severity = props.severity ?: "unknown",
                start = props.start ?: 0L,
                end = props.end ?: 0L,
            )
        }
    }

    private fun parseIsoToTimestamp(iso: String): Long {
        return try {
            Instant.parse(iso).toEpochMilli()
        } catch (_: Exception) {
            System.currentTimeMillis()
        }
    }

    private fun JsonObject.jsonArray(key: String): JsonArray? =
        this[key]?.let {
            when (it) {
                is JsonArray -> it
                is JsonObject -> {
                    // Some weather variables might be nested
                    it["data"] as? JsonArray
                }
                else -> null
            }
        }
}
