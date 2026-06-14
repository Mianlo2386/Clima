package com.weatherflow.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.weatherflow.app.ui.navigation.NavGraph
import com.weatherflow.app.ui.theme.WeatherFlowTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WeatherFlowTheme {
                NavGraph()
            }
        }
    }
}
