package com.weatherflow.app.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "weather_flow_prefs")

class PreferencesRepository(private val context: Context) {

    private object Keys {
        val THEME_MODE = intPreferencesKey("theme_mode")
        val TEMP_UNIT = stringPreferencesKey("temp_unit")
        val GPS_INTERVAL = intPreferencesKey("gps_interval")
        val LAST_CITY_NAME = stringPreferencesKey("last_city_name")
        val LAST_LAT = stringPreferencesKey("last_lat")
        val LAST_LON = stringPreferencesKey("last_lon")
    }

    val themeMode: Flow<Int> = context.dataStore.data.map { prefs ->
        prefs[Keys.THEME_MODE] ?: SYSTEM
    }

    val tempUnit: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[Keys.TEMP_UNIT] ?: "celsius"
    }

    val gpsInterval: Flow<Int> = context.dataStore.data.map { prefs ->
        prefs[Keys.GPS_INTERVAL] ?: 5
    }

    val lastCityName: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[Keys.LAST_CITY_NAME]
    }

    suspend fun setThemeMode(mode: Int) {
        context.dataStore.edit { it[Keys.THEME_MODE] = mode }
    }

    suspend fun setTempUnit(unit: String) {
        context.dataStore.edit { it[Keys.TEMP_UNIT] = unit }
    }

    suspend fun setGpsInterval(minutes: Int) {
        context.dataStore.edit { it[Keys.GPS_INTERVAL] = minutes }
    }

    suspend fun setLastLocation(cityName: String, lat: Double, lon: Double) {
        context.dataStore.edit {
            it[Keys.LAST_CITY_NAME] = cityName
            it[Keys.LAST_LAT] = lat.toString()
            it[Keys.LAST_LON] = lon.toString()
        }
    }

    companion object {
        const val SYSTEM = 0
        const val LIGHT = 1
        const val DARK = 2
    }
}
