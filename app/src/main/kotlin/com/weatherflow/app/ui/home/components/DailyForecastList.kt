package com.weatherflow.app.ui.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.weatherflow.app.domain.model.DailyForecast
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun DailyForecastList(
    forecasts: List<DailyForecast>,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier.fillMaxWidth().padding(16.dp)) {
        Text(
            text = "Pronóstico 14 días",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        LazyColumn {
            items(forecasts) { forecast ->
                DailyForecastItem(forecast)
                HorizontalDivider(
                    color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f),
                )
            }
        }
    }
}

@Composable
private fun DailyForecastItem(forecast: DailyForecast) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(
            text = formatDay(forecast.date),
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = weatherEmoji(forecast.condition),
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.size(32.dp),
        )
        Text(
            text = "${forecast.precipitation.toInt()}mm",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = 8.dp),
        )
        Text(
            text = "${forecast.tempMin.toInt()}°",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Text(
            text = "${forecast.tempMax.toInt()}°",
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(start = 8.dp),
        )
    }
}

private fun formatDay(dateStr: String): String {
    return try {
        val date = LocalDate.parse(dateStr)
        val today = LocalDate.now()
        val tomorrow = today.plusDays(1)
        when {
            date == today -> "Hoy"
            date == tomorrow -> "Mañana"
            else -> date.format(DateTimeFormatter.ofPattern("EEE d/M", Locale("es")))
        }
    } catch (_: Exception) {
        dateStr
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
