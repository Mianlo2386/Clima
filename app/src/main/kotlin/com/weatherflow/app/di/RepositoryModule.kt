package com.weatherflow.app.di

import android.content.Context
import androidx.datastore.preferences.preferencesDataStore
import com.weatherflow.app.data.local.CacheManager
import com.weatherflow.app.data.local.PreferencesRepository
import com.weatherflow.app.data.remote.api.AirQualityApi
import com.weatherflow.app.data.remote.api.AlertApi
import com.weatherflow.app.data.remote.api.GeocodingApi
import com.weatherflow.app.data.remote.api.WeatherApi
import com.weatherflow.app.data.repository.FavoritesRepositoryImpl
import com.weatherflow.app.data.repository.GeocodingRepositoryImpl
import com.weatherflow.app.data.repository.LocationRepositoryImpl
import com.weatherflow.app.data.repository.WeatherRepositoryImpl
import com.weatherflow.app.domain.repository.FavoritesRepository
import com.weatherflow.app.domain.repository.GeocodingRepository
import com.weatherflow.app.domain.repository.LocationRepository
import com.weatherflow.app.domain.repository.WeatherRepository
import com.weatherflow.app.ui.favorites.FavoritesViewModel
import com.weatherflow.app.ui.home.HomeViewModel
import com.weatherflow.app.ui.search.SearchViewModel
import com.weatherflow.app.ui.settings.SettingsViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import org.koin.core.module.dsl.viewModel
import org.koin.dsl.module

private val Context.dataStore by preferencesDataStore(name = "weather_flow_prefs")

val repositoryModule = module {
    single { CacheManager() }

    single<WeatherRepository> {
        WeatherRepositoryImpl(
            weatherApi = get<WeatherApi>(),
            airQualityApi = get<AirQualityApi>(),
            alertApi = get<AlertApi>(),
            cacheManager = get(),
        )
    }

    single<LocationRepository> {
        LocationRepositoryImpl(
            fusedLocationClient = get<FusedLocationProviderClient>(),
            geocodingApi = get<GeocodingApi>(),
            cacheManager = get(),
        )
    }

    single<GeocodingRepository> {
        GeocodingRepositoryImpl(
            geocodingApi = get<GeocodingApi>(),
        )
    }

    single<FavoritesRepository> {
        FavoritesRepositoryImpl(
            dataStore = get<Context>().dataStore,
        )
    }

    single { PreferencesRepository(get()) }

    viewModel {
        HomeViewModel(
            weatherRepository = get(),
            gpsTracker = get(),
        )
    }

    viewModel {
        SearchViewModel(
            geocodingRepository = get(),
        )
    }

    viewModel {
        FavoritesViewModel(
            favoritesRepository = get(),
        )
    }

    viewModel {
        SettingsViewModel(
            preferencesRepository = get(),
        )
    }
}
