package com.weatherflow.app.ui.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.weatherflow.app.domain.model.CurrentWeather
import com.weatherflow.app.domain.model.WeatherCondition

@Composable
fun CurrentWeatherCard(
    weather: CurrentWeather,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "${weather.temperature.toInt()}°",
            style = MaterialTheme.typography.displayLarge.copy(
                fontSize = 96.sp,
                fontWeight = FontWeight.Thin,
            ),
            color = MaterialTheme.colorScheme.onSurface,
        )
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(
                text = weatherConditionLabel(weather.condition),
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = "Sensación ${weather.feelsLike.toInt()}°",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

private fun weatherConditionLabel(condition: WeatherCondition): String = when (condition) {
    WeatherCondition.CLEAR -> "Despejado"
    WeatherCondition.MOSTLY_CLEAR -> "Mayormente despejado"
    WeatherCondition.PARTLY_CLOUDY -> "Parcialmente nublado"
    WeatherCondition.OVERCAST -> "Nublado"
    WeatherCondition.FOG -> "Niebla"
    WeatherCondition.DRIZZLE -> "Llovizna"
    WeatherCondition.RAIN -> "Lluvia"
    WeatherCondition.SNOW -> "Nieve"
    WeatherCondition.RAIN_SHOWER -> "Chubascos"
    WeatherCondition.SNOW_SHOWER -> "Nevadas"
    WeatherCondition.THUNDERSTORM -> "Tormenta eléctrica"
    WeatherCondition.THUNDERSTORM_HAIL -> "Tormenta con granizo"
    WeatherCondition.UNKNOWN -> ""
}
