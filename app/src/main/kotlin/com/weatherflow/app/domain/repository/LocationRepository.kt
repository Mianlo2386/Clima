package com.weatherflow.app.domain.repository

import com.weatherflow.app.domain.model.Location
import kotlinx.coroutines.flow.Flow

interface LocationRepository {
    fun observeLocation(): Flow<Location>
    suspend fun getCurrentLocation(): Location?
    suspend fun reverseGeocode(lat: Double, lon: Double): Result<String>
}
