package com.weatherflow.app.domain.repository

import com.weatherflow.app.domain.model.Location

interface GeocodingRepository {
    suspend fun search(query: String): Result<List<Location>>
    suspend fun reverse(lat: Double, lon: Double): Result<Location>
}
