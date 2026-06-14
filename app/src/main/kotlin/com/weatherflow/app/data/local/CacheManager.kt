package com.weatherflow.app.data.local

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.encodeToString

class CacheManager {

    private val cache = MutableStateFlow<Map<String, CacheEntry>>(emptyMap())

    fun getCached(key: String): CacheResult? {
        val entry = cache.value[key] ?: return null
        val now = currentTimeMillis()
        return CacheResult(
            data = entry.data,
            isStale = now > entry.expiresAt,
            timestamp = entry.timestamp,
        )
    }

    fun set(key: String, data: JsonObject, ttlMillis: Long) {
        val now = currentTimeMillis()
        val entry = CacheEntry(
            data = json.encodeToString(data),
            timestamp = now,
            expiresAt = now + ttlMillis,
        )
        cache.value = cache.value + (key to entry)
    }

    fun clear(key: String) {
        cache.value = cache.value - key
    }

    fun clearAll() {
        cache.value = emptyMap()
    }

    fun observeCache(): StateFlow<Map<String, CacheEntry>> = cache.asStateFlow()

    companion object {
        val json = Json { ignoreUnknownKeys = true }

        // TTL constants in milliseconds
        const val TTL_CURRENT = 15 * 60 * 1000L       // 15 min
        const val TTL_DAILY = 60 * 60 * 1000L          // 1 hour
        const val TTL_HOURLY = 30 * 60 * 1000L         // 30 min
        const val TTL_AIR_QUALITY = 60 * 60 * 1000L    // 1 hour
        const val TTL_CITY_NAME = 24 * 60 * 60 * 1000L // 24 hours

        private fun currentTimeMillis() = System.currentTimeMillis()
    }
}

@Serializable
data class CacheEntry(
    val data: String,
    val timestamp: Long,
    val expiresAt: Long,
)

data class CacheResult(
    val data: String,
    val isStale: Boolean,
    val timestamp: Long,
)
