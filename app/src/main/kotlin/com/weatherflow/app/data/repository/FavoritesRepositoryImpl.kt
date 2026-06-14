package com.weatherflow.app.data.repository

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.weatherflow.app.domain.model.FavoriteCity
import com.weatherflow.app.domain.repository.FavoritesRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class FavoritesRepositoryImpl(
    private val dataStore: DataStore<Preferences>,
) : FavoritesRepository {

    private val json = Json { ignoreUnknownKeys = true }

    private object Keys {
        val FAVORITES = stringPreferencesKey("favorites")
    }

    override fun observeFavorites(): Flow<List<FavoriteCity>> {
        return dataStore.data.map { prefs ->
            val raw = prefs[Keys.FAVORITES] ?: return@map emptyList()
            try {
                json.decodeFromString<List<FavoriteCity>>(raw)
            } catch (_: Exception) {
                emptyList()
            }
        }
    }

    override suspend fun addFavorite(city: FavoriteCity) {
        dataStore.edit { prefs ->
            val current = deserialize(prefs[Keys.FAVORITES])
            if (current.none { it.matches(city) }) {
                prefs[Keys.FAVORITES] = serialize(current + city)
            }
        }
    }

    override suspend fun removeFavorite(city: FavoriteCity) {
        dataStore.edit { prefs ->
            val current = deserialize(prefs[Keys.FAVORITES])
            prefs[Keys.FAVORITES] = serialize(current.filterNot { it.matches(city) })
        }
    }

    override suspend fun isFavorite(cityName: String, lat: Double, lon: Double): Boolean {
        return dataStore.data.map { prefs ->
            val current = deserialize(prefs[Keys.FAVORITES])
            current.any { it.matches(cityName, lat, lon) }
        }.let { flow ->
            var result = false
            flow.collect { result = it }
            result
        }
    }

    private fun deserialize(raw: String?): List<FavoriteCity> {
        if (raw.isNullOrBlank()) return emptyList()
        return try {
            json.decodeFromString<List<FavoriteCity>>(raw)
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun serialize(cities: List<FavoriteCity>): String {
        return try {
            json.encodeToString(cities)
        } catch (_: Exception) {
            "[]"
        }
    }

    private fun FavoriteCity.matches(other: FavoriteCity): Boolean =
        name == other.name && latitude == other.latitude && longitude == other.longitude

    private fun FavoriteCity.matches(name: String, lat: Double, lon: Double): Boolean =
        this.name == name && this.latitude == lat && this.longitude == lon
}
