package com.weatherflow.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.weatherflow.app.data.location.GpsTracker
import com.weatherflow.app.domain.model.AirQuality
import com.weatherflow.app.domain.model.CurrentWeather
import com.weatherflow.app.domain.model.DailyForecast
import com.weatherflow.app.domain.model.HourlyForecast
import com.weatherflow.app.domain.model.Location
import com.weatherflow.app.domain.model.WeatherAlert
import com.weatherflow.app.domain.repository.WeatherRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HomeUiState(
    val location: Location? = null,
    val currentWeather: CurrentWeather? = null,
    val dailyForecast: List<DailyForecast> = emptyList(),
    val hourlyForecast: List<HourlyForecast> = emptyList(),
    val airQuality: AirQuality? = null,
    val alerts: List<WeatherAlert> = emptyList(),
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val error: String? = null,
)

class HomeViewModel(
    private val weatherRepository: WeatherRepository,
    private val gpsTracker: GpsTracker,
) : ViewModel() {

    private val _state = MutableStateFlow(HomeUiState())
    val state: StateFlow<HomeUiState> = _state.asStateFlow()

    private var currentLat: Double = 0.0
    private var currentLon: Double = 0.0

    fun start() {
        observeLocation()
    }

    fun onGpsDenied() {
        _state.value = _state.value.copy(
            isLoading = false,
            error = "Permiso de ubicación denegado",
        )
    }

    fun refresh() {
        _state.value = _state.value.copy(isRefreshing = true)
        fetchAllWeather()
    }

    fun retry() {
        _state.value = _state.value.copy(isLoading = true, error = null)
        fetchAllWeather()
    }

    private fun observeLocation() {
        viewModelScope.launch {
            try {
                gpsTracker.observeLocation().collect { location ->
                    _state.value = _state.value.copy(location = location)
                    currentLat = location.latitude
                    currentLon = location.longitude
                    fetchAllWeather()
                }
            } catch (_: Exception) {
                if (_state.value.currentWeather == null) {
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "No se pudo obtener la ubicación",
                    )
                }
            }
        }
    }

    private fun fetchAllWeather() {
        viewModelScope.launch {
            try {
                val weatherResult = weatherRepository.getCurrentWeather(currentLat, currentLon)
                val dailyResult = weatherRepository.getDailyForecast(currentLat, currentLon)
                val hourlyResult = weatherRepository.getHourlyForecast(currentLat, currentLon)
                val aqiResult = weatherRepository.getAirQuality(currentLat, currentLon)
                val alertsResult = weatherRepository.getWeatherAlerts(currentLat, currentLon)

                _state.value = _state.value.copy(
                    currentWeather = weatherResult.getOrNull(),
                    dailyForecast = dailyResult.getOrNull() ?: emptyList(),
                    hourlyForecast = hourlyResult.getOrNull() ?: emptyList(),
                    airQuality = aqiResult.getOrNull(),
                    alerts = alertsResult.getOrNull() ?: emptyList(),
                    isLoading = false,
                    isRefreshing = false,
                    error = if (weatherResult.isFailure) {
                    val ex = weatherResult.exceptionOrNull()
                    "${ex?.javaClass?.simpleName}: ${ex?.message}"
                } else null,
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    isRefreshing = false,
                    error = e.message ?: "Error al cargar el clima",
                )
            }
        }
    }
}
