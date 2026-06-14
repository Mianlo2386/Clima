package com.weatherflow.app.di

import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.weatherflow.app.data.location.GpsTracker
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.module

val locationModule = module {
    single<FusedLocationProviderClient> {
        LocationServices.getFusedLocationProviderClient(androidContext())
    }

    single { GpsTracker(get()) }
}
