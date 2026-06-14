package com.weatherflow.app.ui.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.weatherflow.app.domain.model.HourlyForecast

@Composable
fun HourlyForecastRow(
    forecasts: List<HourlyForecast>,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier.fillMaxWidth().padding(16.dp)) {
        Text(
            text = "Próximas horas",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(horizontal = 4.dp),
        ) {
            items(forecasts) { forecast ->
                HourlyItem(forecast)
            }
        }
    }
}

@Composable
private fun HourlyItem(forecast: HourlyForecast) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.size(width = 64.dp, height = 100.dp),
    ) {
        Text(
            text = formatHour(forecast.time),
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Text(
            text = weatherEmoji(forecast.condition),
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(vertical = 4.dp),
        )
        Text(
            text = "${forecast.temperature.toInt()}°",
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface,
        )
        Text(
            text = "${forecast.precipitationProbability}%",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.primary,
        )
    }
}

private fun formatHour(iso: String): String {
    return try {
        iso.substringAfter("T").take(5)
    } catch (_: Exception) {
        iso
    }
}

private fun weatherEmoji(condition: com.weatherflow.app.domain.model.WeatherCondition): String = when (condition) {
    com.weatherflow.app.domain.model.WeatherCondition.CLEAR -> "☀️"
    com.weatherflow.app.domain.model.WeatherCondition.MOSTLY_CLEAR -> "🌤"
    com.weatherflow.app.domain.model.WeatherCondition.PARTLY_CLOUDY -> "⛅"
    com.weatherflow.app.domain.model.WeatherCondition.OVERCAST -> "☁️"
    com.weatherflow.app.domain.model.WeatherCondition.FOG -> "🌫"
    com.weatherflow.app.domain.model.WeatherCondition.DRIZZLE -> "🌦"
    com.weatherflow.app.domain.model.WeatherCondition.RAIN -> "🌧"
    com.weatherflow.app.domain.model.WeatherCondition.SNOW -> "❄️"
    com.weatherflow.app.domain.model.WeatherCondition.RAIN_SHOWER -> "🌧"
    com.weatherflow.app.domain.model.WeatherCondition.SNOW_SHOWER -> "❄️"
    com.weatherflow.app.domain.model.WeatherCondition.THUNDERSTORM -> "⛈"
    com.weatherflow.app.domain.model.WeatherCondition.THUNDERSTORM_HAIL -> "⛈"
    com.weatherflow.app.domain.model.WeatherCondition.UNKNOWN -> "❓"
}
