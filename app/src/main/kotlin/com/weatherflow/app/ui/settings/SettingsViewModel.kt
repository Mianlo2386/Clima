package com.weatherflow.app.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.weatherflow.app.data.local.PreferencesRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class SettingsUiState(
    val themeMode: Int = PreferencesRepository.SYSTEM,
    val tempUnit: String = "celsius",
    val gpsInterval: Int = 5,
)

class SettingsViewModel(
    private val preferencesRepository: PreferencesRepository,
) : ViewModel() {

    val state: StateFlow<SettingsUiState> = combine(
        preferencesRepository.themeMode,
        preferencesRepository.tempUnit,
        preferencesRepository.gpsInterval,
    ) { theme, unit, interval ->
        SettingsUiState(themeMode = theme, tempUnit = unit, gpsInterval = interval)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SettingsUiState())

    fun setThemeMode(mode: Int) {
        viewModelScope.launch { preferencesRepository.setThemeMode(mode) }
    }

    fun setTempUnit(unit: String) {
        viewModelScope.launch { preferencesRepository.setTempUnit(unit) }
    }

    fun setGpsInterval(minutes: Int) {
        viewModelScope.launch { preferencesRepository.setGpsInterval(minutes) }
    }
}

private fun <T1, T2, T3, R> combine(
    flow1: kotlinx.coroutines.flow.Flow<T1>,
    flow2: kotlinx.coroutines.flow.Flow<T2>,
    flow3: kotlinx.coroutines.flow.Flow<T3>,
    transform: suspend (T1, T2, T3) -> R,
): kotlinx.coroutines.flow.Flow<R> = kotlinx.coroutines.flow.combine(flow1, flow2, flow3) { a, b, c ->
    transform(a, b, c)
}
