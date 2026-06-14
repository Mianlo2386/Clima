package com.weatherflow.app.data.repository

import android.os.Looper
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.Priority
import com.weatherflow.app.data.local.CacheManager
import com.weatherflow.app.data.remote.api.GeocodingApi
import com.weatherflow.app.domain.model.Location
import com.weatherflow.app.domain.repository.LocationRepository
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import kotlinx.serialization.json.jsonObject

class LocationRepositoryImpl(
    private val fusedLocationClient: FusedLocationProviderClient,
    private val geocodingApi: GeocodingApi,
    private val cacheManager: CacheManager,
) : LocationRepository {

    override fun observeLocation(): Flow<Location> = callbackFlow {
        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val androidLocation = result.lastLocation
                if (androidLocation != null) {
                    trySend(
                        Location(
                            latitude = androidLocation.latitude,
                            longitude = androidLocation.longitude,
                            cityName = "Cargando...",
                        )
                    )
                }
            }
        }

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            300_000L,
        ).apply {
            setMinUpdateIntervalMillis(60_000L)
            setMinUpdateDistanceMeters(500f)
        }.build()

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            callback,
            Looper.getMainLooper(),
        )

        awaitClose {
            fusedLocationClient.removeLocationUpdates(callback)
        }
    }

    override suspend fun getCurrentLocation(): Location? {
        return try {
            val task = fusedLocationClient.lastLocation
            val androidLocation = task.await()

            if (androidLocation != null) {
                Location(
                    latitude = androidLocation.latitude,
                    longitude = androidLocation.longitude,
                    cityName = "Cargando...",
                )
            } else {
                val currentTask = fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    null,
                )
                val currentLocation = currentTask.await()
                if (currentLocation != null) {
                    Location(
                        latitude = currentLocation.latitude,
                        longitude = currentLocation.longitude,
                        cityName = "Cargando...",
                    )
                } else {
                    null
                }
            }
        } catch (_: Exception) {
            null
        }
    }

    override suspend fun reverseGeocode(lat: Double, lon: Double): Result<String> {
        return runCatching {
            val cacheKey = "geo_${lat}_${lon}"
            val cached = cacheManager.getCached(cacheKey)
            if (cached != null) {
                return@runCatching cached.data
            }

            val response = geocodingApi.reverse(lat, lon)
            val name = response.results?.firstOrNull()?.name
                ?: "Ubicación desconocida"

            cacheManager.set(
                cacheKey,
                CacheManager.json.parseToJsonElement("{\"city\":\"$name\"}").jsonObject,
                CacheManager.TTL_CITY_NAME,
            )
            name
        }
    }
}
