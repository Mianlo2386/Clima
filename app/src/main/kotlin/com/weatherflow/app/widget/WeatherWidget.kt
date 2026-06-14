package com.weatherflow.app.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

class WeatherWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            WidgetContent()
        }
    }

    suspend fun updateAllInstances(context: Context) {
        val manager = GlanceAppWidgetManager(context)
        val ids = manager.getGlanceIds(WeatherWidget::class.java)
        ids.forEach { id -> update(context, id) }
    }
}

@androidx.compose.runtime.Composable
private fun WidgetContent() {
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(ColorProvider(0xCC1B2838.toInt())),
        verticalAlignment = Alignment.CenterVertically,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "--°",
            style = TextStyle(
                color = ColorProvider(android.graphics.Color.WHITE),
                fontWeight = FontWeight.Bold,
            ),
        )
        Text(
            text = "Weather Flow",
            style = TextStyle(
                color = ColorProvider(0xFF90A4AE.toInt()),
            ),
        )
    }
}
