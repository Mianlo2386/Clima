package com.weatherflow.app.ui.home

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.weatherflow.app.data.location.PermissionHelper
import com.weatherflow.app.ui.home.components.AirQualityCard
import com.weatherflow.app.ui.home.components.AlertBanner
import com.weatherflow.app.ui.home.components.AnimatedBackground
import com.weatherflow.app.ui.home.components.CurrentWeatherCard
import com.weatherflow.app.ui.home.components.DailyForecastList
import com.weatherflow.app.ui.home.components.HourlyForecastRow
import com.weatherflow.app.ui.home.components.LocationHeader
import com.weatherflow.app.ui.home.components.MetricsRow
import com.weatherflow.app.ui.common.ErrorView
import com.weatherflow.app.ui.common.LoadingIndicator

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onSettingsClick: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
    ) { permissions ->
        if (permissions.values.all { it }) {
            viewModel.start()
        } else {
            viewModel.onGpsDenied()
        }
    }

    LaunchedEffect(Unit) {
        if (PermissionHelper.hasLocationPermissions(context)) {
            viewModel.start()
        } else {
            permissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                )
            )
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        AnimatedBackground(
            condition = state.currentWeather?.condition,
            isNight = false,
        )

        when {
            state.isLoading && state.currentWeather == null -> {
                LoadingIndicator(
                    modifier = Modifier.align(Alignment.Center),
                )
            }
            state.error != null && state.currentWeather == null -> {
                ErrorView(
                    message = state.error ?: "Error desconocido",
                    onRetry = { viewModel.retry() },
                    modifier = Modifier.align(Alignment.Center),
                )
            }
            else -> {
                PullToRefreshBox(
                    isRefreshing = state.isRefreshing,
                    onRefresh = { viewModel.refresh() },
                    modifier = Modifier.fillMaxSize(),
                ) {
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        item {
                            state.location?.let { location ->
                                LocationHeader(
                                    cityName = location.cityName,
                                    country = location.country,
                                    onSettingsClick = onSettingsClick,
                                )
                            }
                        }

                        item {
                            state.currentWeather?.let { weather ->
                                CurrentWeatherCard(weather = weather)
                            }
                        }

                        item {
                            state.currentWeather?.let { weather ->
                                MetricsRow(
                                    humidity = weather.humidity,
                                    windSpeed = weather.windSpeed,
                                    uvIndex = state.dailyForecast.firstOrNull()?.uvIndex ?: 0.0,
                                    pressure = weather.pressure,
                                )
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(8.dp))
                        }

                        item {
                            state.alerts.firstOrNull()?.let { alert ->
                                AlertBanner(alert = alert)
                                Spacer(modifier = Modifier.height(8.dp))
                            }
                        }

                        item {
                            HourlyForecastRow(forecasts = state.hourlyForecast)
                        }

                        item {
                            DailyForecastList(forecasts = state.dailyForecast)
                        }

                        item {
                            state.airQuality?.let { aqi ->
                                AirQualityCard(airQuality = aqi)
                                Spacer(modifier = Modifier.height(32.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
