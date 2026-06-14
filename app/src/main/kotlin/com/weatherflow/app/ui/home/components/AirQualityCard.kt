package com.weatherflow.app.ui.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.weatherflow.app.domain.model.AirQuality

@Composable
fun AirQualityCard(
    airQuality: AirQuality,
    modifier: Modifier = Modifier,
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Calidad del Aire",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                val aqi = airQuality.europeanAqi ?: airQuality.usAqi ?: 0
                val (label, color) = aqiLabel(aqi)

                Column {
                    Text(
                        text = aqi.toString(),
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodyMedium,
                        color = color,
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    airQuality.pm25?.let {
                        Text("PM2.5: ${it.toInt()} µg/m³", style = MaterialTheme.typography.bodySmall)
                    }
                    airQuality.pm10?.let {
                        Text("PM10: ${it.toInt()} µg/m³", style = MaterialTheme.typography.bodySmall)
                    }
                    airQuality.ozone?.let {
                        Text("O₃: ${it.toInt()} µg/m³", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}

private fun aqiLabel(aqi: Int): Pair<String, androidx.compose.ui.graphics.Color> {
    return when {
        aqi <= 20 -> "Buena" to androidx.compose.ui.graphics.Color(0xFF4CAF50)
        aqi <= 40 -> "Favorable" to androidx.compose.ui.graphics.Color(0xFF8BC34A)
        aqi <= 60 -> "Moderada" to androidx.compose.ui.graphics.Color(0xFFFFC107)
        aqi <= 80 -> "Desfavorable" to androidx.compose.ui.graphics.Color(0xFFFF9800)
        aqi <= 100 -> "Mala" to androidx.compose.ui.graphics.Color(0xFFFF5722)
        else -> "Muy mala" to androidx.compose.ui.graphics.Color(0xFFF44336)
    }
}
