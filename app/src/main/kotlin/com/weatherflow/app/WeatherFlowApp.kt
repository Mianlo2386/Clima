package com.weatherflow.app

import android.app.Application
import com.weatherflow.app.di.locationModule
import com.weatherflow.app.di.networkModule
import com.weatherflow.app.di.repositoryModule
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class WeatherFlowApp : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@WeatherFlowApp)
            modules(
                networkModule,
                locationModule,
                repositoryModule,
            )
        }
    }
}
