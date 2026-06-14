package com.weatherflow.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WeatherAlertDto(
    val features: List<AlertFeature> = emptyList(),
)

@Serializable
data class AlertFeature(
    val properties: AlertProperties,
)

@Serializable
data class AlertProperties(
    val headline: String? = null,
    val description: String? = null,
    val severity: String? = null,
    @SerialName("effective") val start: Long? = null,
    @SerialName("expires") val end: Long? = null,
)
