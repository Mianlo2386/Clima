package com.weatherflow.app.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class FavoriteCity(
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val country: String,
)
