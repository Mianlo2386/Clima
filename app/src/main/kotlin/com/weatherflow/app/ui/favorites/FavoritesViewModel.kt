package com.weatherflow.app.ui.favorites

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.weatherflow.app.domain.model.FavoriteCity
import com.weatherflow.app.domain.repository.FavoritesRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class FavoritesViewModel(
    private val favoritesRepository: FavoritesRepository,
) : ViewModel() {

    val favorites: StateFlow<List<FavoriteCity>> = favoritesRepository.observeFavorites()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun removeFavorite(city: FavoriteCity) {
        viewModelScope.launch {
            favoritesRepository.removeFavorite(city)
        }
    }
}
