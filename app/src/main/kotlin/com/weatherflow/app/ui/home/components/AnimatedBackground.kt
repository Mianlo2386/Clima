package com.weatherflow.app.ui.home.components

import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.weatherflow.app.domain.model.WeatherCondition

@Composable
fun AnimatedBackground(
    condition: WeatherCondition?,
    isNight: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val colors = conditionColors(condition, isNight)
    val transition = rememberInfiniteTransition(label = "bg")
    val progress by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 5000),
        ),
        label = "gradient",
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.linearGradient(
                    colors = colors,
                    start = Offset(0f, 0f),
                    end = Offset(progress * 1000f, progress * 1000f),
                ),
            ),
    )
}

private fun conditionColors(condition: WeatherCondition?, isNight: Boolean): List<Color> {
    return when {
        isNight -> listOf(
            Color(0xFF0D1B2A),
            Color(0xFF1B2838),
            Color(0xFF162447),
        )
        condition == null -> listOf(
            Color(0xFF1565C0),
            Color(0xFF64B5F6),
        )
        condition == WeatherCondition.CLEAR || condition == WeatherCondition.MOSTLY_CLEAR -> listOf(
            Color(0xFF1565C0),
            Color(0xFF64B5F6),
            Color(0xFF90CAF9),
        )
        condition == WeatherCondition.PARTLY_CLOUDY || condition == WeatherCondition.OVERCAST -> listOf(
            Color(0xFF455A64),
            Color(0xFF90A4AE),
            Color(0xFFB0BEC5),
        )
        condition == WeatherCondition.DRIZZLE || condition == WeatherCondition.RAIN ||
            condition == WeatherCondition.RAIN_SHOWER -> listOf(
            Color(0xFF37474F),
            Color(0xFF546E7A),
            Color(0xFF78909C),
        )
        condition == WeatherCondition.SNOW || condition == WeatherCondition.SNOW_SHOWER -> listOf(
            Color(0xFFECEFF1),
            Color(0xFFB0BEC5),
            Color(0xFFCFD8DC),
        )
        condition == WeatherCondition.THUNDERSTORM || condition == WeatherCondition.THUNDERSTORM_HAIL -> listOf(
            Color(0xFF311B92),
            Color(0xFF4527A0),
            Color(0xFF5E35B1),
        )
        condition == WeatherCondition.FOG -> listOf(
            Color(0xFF78909C),
            Color(0xFFB0BEC5),
            Color(0xFF90A4AE),
        )
        else -> listOf(
            Color(0xFF1565C0),
            Color(0xFF64B5F6),
        )
    }
}
