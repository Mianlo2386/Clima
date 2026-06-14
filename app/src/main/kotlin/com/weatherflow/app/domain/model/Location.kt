package com.weatherflow.app.domain.model

data class Location(
    val latitude: Double,
    val longitude: Double,
    val cityName: String,
    val country: String = "",
)
