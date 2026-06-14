package com.weatherflow.app.data.repository

import com.weatherflow.app.data.remote.api.GeocodingApi
import com.weatherflow.app.domain.model.Location
import com.weatherflow.app.domain.repository.GeocodingRepository

class GeocodingRepositoryImpl(
    private val geocodingApi: GeocodingApi,
) : GeocodingRepository {

    override suspend fun search(query: String): Result<List<Location>> {
        return runCatching {
            val response = geocodingApi.search(query)
            response.results?.map { result ->
                Location(
                    latitude = result.latitude,
                    longitude = result.longitude,
                    cityName = result.name,
                    country = result.country ?: "",
                )
            } ?: emptyList()
        }
    }

    override suspend fun reverse(lat: Double, lon: Double): Result<Location> {
        return runCatching {
            val response = geocodingApi.reverse(lat, lon)
            val result = response.results?.firstOrNull()
                ?: throw Exception("No se encontró ubicación para estas coordenadas")
            Location(
                latitude = result.latitude,
                longitude = result.longitude,
                cityName = result.name,
                country = result.country ?: "",
            )
        }
    }
}
