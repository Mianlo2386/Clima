package com.weatherflow.app.ui.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.weatherflow.app.domain.model.Location
import com.weatherflow.app.domain.repository.GeocodingRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SearchUiState(
    val query: String = "",
    val results: List<Location> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
)

class SearchViewModel(
    private val geocodingRepository: GeocodingRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(SearchUiState())
    val state: StateFlow<SearchUiState> = _state.asStateFlow()

    private var searchJob: Job? = null

    fun onQueryChanged(query: String) {
        _state.value = _state.value.copy(query = query)
        searchJob?.cancel()
        if (query.length < 2) {
            _state.value = _state.value.copy(results = emptyList())
            return
        }
        searchJob = viewModelScope.launch {
            delay(300)
            _state.value = _state.value.copy(isLoading = true, error = null)
            val result = geocodingRepository.search(query)
            result.onSuccess { cities ->
                _state.value = _state.value.copy(results = cities, isLoading = false)
            }.onFailure { e ->
                _state.value = _state.value.copy(error = e.message, isLoading = false)
            }
        }
    }

    fun selectCity(location: Location) {
        // The caller handles navigation with the selected location
    }
}
