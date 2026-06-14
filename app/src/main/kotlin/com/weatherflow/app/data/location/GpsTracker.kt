package com.weatherflow.app.data.location

import android.os.Looper
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.Priority
import com.weatherflow.app.domain.model.Location
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

enum class MovementState {
    MOVING,
    STATIC,
    UNKNOWN,
}

class GpsTracker(
    private val fusedLocationClient: FusedLocationProviderClient,
) {
    private var lastLocation: android.location.Location? = null
    private var lastMovementTime: Long = 0L
    private var movementState: MovementState = MovementState.UNKNOWN

    fun observeLocation(): Flow<Location> = callbackFlow {
        var currentInterval = INITIAL_INTERVAL

        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { androidLocation ->
                    updateMovementState(androidLocation)
                    currentInterval = resolveInterval()

                    val location = Location(
                        latitude = androidLocation.latitude,
                        longitude = androidLocation.longitude,
                        cityName = "Cargando...",
                    )
                    trySend(location)
                }
            }
        }

        val request = buildLocationRequest(currentInterval)
        fusedLocationClient.requestLocationUpdates(request, callback, Looper.getMainLooper())

        awaitClose {
            fusedLocationClient.removeLocationUpdates(callback)
        }
    }

    private fun updateMovementState(current: android.location.Location) {
        val prev = lastLocation
        lastLocation = current

        if (prev == null) {
            movementState = MovementState.UNKNOWN
            return
        }

        val distance = current.distanceTo(prev)
        val now = System.currentTimeMillis()

        if (distance > MOVEMENT_THRESHOLD) {
            movementState = MovementState.MOVING
            lastMovementTime = now
        } else if (now - lastMovementTime > STATIC_TIMEOUT) {
            movementState = MovementState.STATIC
        }
    }

    private fun resolveInterval(): Long {
        return when (movementState) {
            MovementState.MOVING -> MOVING_INTERVAL
            MovementState.STATIC -> STATIC_INTERVAL
            MovementState.UNKNOWN -> INITIAL_INTERVAL
        }
    }

    private fun buildLocationRequest(interval: Long): LocationRequest {
        return LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, interval)
            .setMinUpdateIntervalMillis(interval / 2)
            .setMinUpdateDistanceMeters(MOVEMENT_THRESHOLD)
            .build()
    }

    companion object {
        private const val MOVEMENT_THRESHOLD = 500f
        private const val STATIC_TIMEOUT = 30 * 60 * 1000L
        private const val INITIAL_INTERVAL = 300_000L
        private const val MOVING_INTERVAL = 300_000L
        private const val STATIC_INTERVAL = 900_000L
    }
}
