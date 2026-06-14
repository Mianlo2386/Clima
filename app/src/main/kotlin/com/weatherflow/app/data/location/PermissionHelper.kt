package com.weatherflow.app.data.location

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

object PermissionHelper {

    private val LOCATION_PERMISSIONS = arrayOf(
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION,
    )

    fun hasLocationPermissions(context: Context): Boolean {
        return LOCATION_PERMISSIONS.all { permission ->
            val result = ContextCompat.checkSelfPermission(context, permission)
            result == PackageManager.PERMISSION_GRANTED
        }
    }

    fun getMissingPermissions(context: Context): Array<String> {
        val missing = mutableListOf<String>()
        for (permission in LOCATION_PERMISSIONS) {
            val result = ContextCompat.checkSelfPermission(context, permission)
            if (result != PackageManager.PERMISSION_GRANTED) {
                missing.add(permission)
            }
        }
        return missing.toTypedArray()
    }
}
