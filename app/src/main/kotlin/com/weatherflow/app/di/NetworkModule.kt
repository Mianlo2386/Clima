package com.weatherflow.app.di

import com.weatherflow.app.data.remote.api.AirQualityApi
import com.weatherflow.app.data.remote.api.AlertApi
import com.weatherflow.app.data.remote.api.GeocodingApi
import com.weatherflow.app.data.remote.api.WeatherApi
import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import org.koin.dsl.module

val networkModule = module {
    single {
        HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    isLenient = true
                    coerceInputValues = true
                })
            }
            install(Logging) {
                level = LogLevel.ALL
            }
        }
    }

    single { WeatherApi(get()) }
    single { AirQualityApi(get()) }
    single { AlertApi(get()) }
    single { GeocodingApi(get()) }
}
