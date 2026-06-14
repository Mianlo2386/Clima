package com.weatherflow.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class GeocodingResultDto(
    val id: Long,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val country: String? = null,
    @kotlinx.serialization.SerialName("country_code") val countryCode: String? = null,
    val timezone: String? = null,
)

@Serializable
data class GeocodingDto(
    val results: List<GeocodingResultDto>? = null,
)
