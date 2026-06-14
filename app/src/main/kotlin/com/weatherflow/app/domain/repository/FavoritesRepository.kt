package com.weatherflow.app.domain.repository

import com.weatherflow.app.domain.model.FavoriteCity
import kotlinx.coroutines.flow.Flow

interface FavoritesRepository {
    fun observeFavorites(): Flow<List<FavoriteCity>>
    suspend fun addFavorite(city: FavoriteCity)
    suspend fun removeFavorite(city: FavoriteCity)
    suspend fun isFavorite(cityName: String, lat: Double, lon: Double): Boolean
}
