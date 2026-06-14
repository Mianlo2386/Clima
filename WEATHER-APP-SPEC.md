# Weather Flow — Spec Técnico

> **Propósito**: Fuente de verdad para la Legión de sub-agentes.
> **Stack**: 100 % gratuito, cero API keys, cero registro, cero tarjeta de crédito.
> **Uso**: Personal (non-commercial).

---

## 1. Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Lenguaje | Kotlin 2.0+ | Moderno, conciso,官方 |
| UI | Jetpack Compose + Material3 | Reactivo, animaciones nativas, theming |
| DI | Koin | Liviano, sin codegen |
| Networking | Ktor Client + ContentNegotiation | Kotlin-first, multiplataforma |
| Async | Coroutines + Flow | Nativo de Kotlin |
| Local | DataStore Preferences + Proto | Cache + favoritos |
| Widget | Jetpack Glance | Widgets declarativos estilo Compose |
| Background | WorkManager | Actualización periódica del widget |
| GPS | Google Play Services Location | Precisión + fused provider |
| Testing | JUnit5 + MockK + Turbine | Flow testing |

---

## 2. APIs Externas (100 % Gratis)

### 2.1 Open-Meteo — Weather Forecast

- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Auth**: ❌ No necesita
- **Límite**: ~10.000 req/día (fair use)
- **Modelos**: NOAA GFS, DWD ICON, ECMWF IFS (selección automática)

| Parámetro | Ejemplo | Descripción |
|-----------|---------|-------------|
| `latitude` | `-34.61` | Latitud |
| `longitude` | `-58.38` | Longitud |
| `current` | `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,pressure_msl` | Variables del momento actual |
| `daily` | `weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max` | Variables diarias (14 días) |
| `hourly` | `temperature_2m,precipitation_probability,weather_code,relative_humidity_2m,wind_speed_10m,uv_index` | Variables horarias (próximas 24h) |
| `timezone` | `auto` | Detecta zona horaria de las coordenadas |
| `forecast_days` | `14` | Cantidad de días |
| `forecast_hours` | `24` | Cantidad de horas |

### 2.2 Open-Meteo — Air Quality

- **URL**: `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Auth**: ❌ No necesita

| Parámetro | Ejemplo |
|-----------|---------|
| `current` | `european_aqi,us_aqi,pm2_5,pm10,ozone` |
| `hourly` | `european_aqi,pm2_5` |

### 2.3 Open-Meteo — Weather Alerts

- **URL**: `https://api.open-meteo.com/v1/weather-alerts`
- **Auth**: ❌ No necesita

### 2.4 Open-Meteo — Geocoding

- **URL Forward**: `https://geocoding-api.open-meteo.com/v1/search`
- **URL Reverse**: `https://geocoding-api.open-meteo.com/v1/reverse`
- **Auth**: ❌ No necesita

| Parámetro | Ejemplo | Uso |
|-----------|---------|-----|
| `name` | `Buenos Aires` | Búsqueda manual |
| `latitude`/`longitude` | `-34.61`/`-58.38` | Reverse geocoding |
| `count` | `5` | Resultados máximos |
| `language` | `es` | Idioma |
| `format` | `json` | Formato de respuesta |

### 2.5 Google Play Services Location

- **API**: `FusedLocationProviderClient`
- **Costo**: Gratis
- **Permiso**: `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`

---

## 3. Arquitectura de Componentes

```
app/
├── WeatherFlowApp.kt                   # Application class + Koin init
├── MainActivity.kt                      # Single Activity
│
├── di/
│   ├── NetworkModule.kt                 # Ktor HttpClient + JSON
│   ├── RepositoryModule.kt              # Repos + DataStore
│   └── LocationModule.kt                # FusedLocationProviderClient
│
├── data/
│   ├── remote/
│   │   ├── api/
│   │   │   ├── WeatherApi.kt            # Open-Meteo forecast
│   │   │   ├── AirQualityApi.kt         # Open-Meteo AQI
│   │   │   ├── AlertApi.kt              # Open-Meteo alerts
│   │   │   └── GeocodingApi.kt          # Open-Meteo geocoding
│   │   │
│   │   ├── dto/
│   │   │   ├── WeatherResponseDto.kt    # current + daily + hourly
│   │   │   ├── AirQualityDto.kt
│   │   │   ├── AlertDto.kt
│   │   │   └── GeocodingDto.kt
│   │   │
│   │   └── mapper/
│   │       ├── WeatherMapper.kt         # DTO → Domain + WMO codes
│   │       └── GeocodingMapper.kt
│   │
│   ├── local/
│   │   ├── PreferencesRepository.kt     # DataStore: favoritos + tema
│   │   └── CacheManager.kt             # TTL + stale-while-revalidate
│   │
│   └── repository/
│       ├── WeatherRepositoryImpl.kt
│       ├── LocationRepositoryImpl.kt
│       ├── GeocodingRepositoryImpl.kt
│       └── FavoritesRepositoryImpl.kt
│
├── domain/
│   ├── model/
│   │   ├── CurrentWeather.kt
│   │   ├── DailyForecast.kt
│   │   ├── HourlyForecast.kt
│   │   ├── WeatherCondition.kt          # Enum basado en WMO
│   │   ├── AirQuality.kt
│   │   ├── WeatherAlert.kt
│   │   ├── Location.kt
│   │   └── FavoriteCity.kt
│   │
│   └── repository/
│       ├── WeatherRepository.kt         # Interface
│       ├── LocationRepository.kt
│       ├── GeocodingRepository.kt
│       └── FavoritesRepository.kt
│
├── ui/
│   ├── theme/
│   │   ├── Theme.kt                     # Material3 + dinamic colors
│   │   ├── Color.kt                     # Paletas claro/oscuro
│   │   ├── Type.kt                      # Tipografía
│   │   └── WeatherGradients.kt          # Fondos animados x condición
│   │
│   ├── navigation/
│   │   └── NavGraph.kt                  # NavHost + rutas
│   │
│   ├── home/
│   │   ├── HomeScreen.kt                # Pantalla principal scroll vertical
│   │   ├── HomeViewModel.kt
│   │   └── components/
│   │       ├── LocationHeader.kt         # Ciudad + botón favorito
│   │       ├── CurrentWeatherCard.kt     # Temp grande + ícono + condición
│   │       ├── MetricsRow.kt            # Sensación, H°, viento, UV
│   │       ├── HourlyForecastRow.kt     # Scrolleable horizontal 24h
│   │       ├── DailyForecastList.kt     # 14 días scroll vertical
│   │       ├── DailyForecastItem.kt     # Día individual
│   │       ├── AirQualityCard.kt        # AQI + PM2.5 + Ozono
│   │       ├── AlertBanner.kt           # Alertas activas
│   │       └── AnimatedBackground.kt    # Según condición climática
│   │
│   ├── search/
│   │   ├── SearchScreen.kt              # Búsqueda manual de ciudades
│   │   ├── SearchViewModel.kt
│   │   └── components/
│   │       └── CityResultItem.kt
│   │
│   ├── favorites/
│   │   ├── FavoritesScreen.kt           # Swipeable entre ciudades
│   │   ├── FavoritesViewModel.kt
│   │   └── components/
│   │       ├── CityPager.kt             # ViewPager horizontal
│   │       └── CitySummaryCard.kt
│   │
│   ├── settings/
│   │   ├── SettingsScreen.kt
│   │   ├── SettingsViewModel.kt
│   │   └── components/
│   │       └── SettingsOption.kt
│   │
│   └── common/
│       ├── LoadingIndicator.kt
│       ├── ErrorView.kt
│       └── ShimmerEffect.kt
│
└── widget/
    ├── WeatherWidget.kt                 # GlanceAppWidget
    ├── WeatherWidgetReceiver.kt         # GlanceAppWidgetReceiver
    ├── WeatherWidgetWorker.kt           # PeriodicWorkRequest
    └── components/
        └── WidgetLayout.kt             # Composable de Glance
```

---

## 4. Flujo de Datos

```
GPSTracker (callbackFlow)
    ↓ lat/lon
LocationRepository
    ↓ lat/lon + cityName
WeatherRepository.fetchAll(lat, lon)
    ├── OpenMeteo: forecast (current + daily + hourly)
    ├── OpenMeteo: air-quality
    ├── OpenMeteo: weather-alerts
    └── OpenMeteo: reverse geocoding (solo primer fetch)
         ↓
WeatherMapper.toDomain()   ← WMO code → WeatherCondition enum
         ↓
UiState(current, daily[14], hourly[24], aqi, alerts, location)
         ↓
HomeViewModel (StateFlow)
         ↓
HomeScreen (collectAsStateWithLifecycle)
```

---

## 5. WMO Weather Codes → WeatherCondition

Open-Meteo usa códigos WMO (World Meteorological Organization). Mapeo completo:

| Código | Condición | Icono |
|--------|-----------|-------|
| 0 | Cielo despejado | ☀️ |
| 1 | Mayormente despejado | 🌤 |
| 2 | Parcialmente nublado | ⛅ |
| 3 | Nublado | ☁️ |
| 45, 48 | Niebla / Neblina | 🌫 |
| 51, 53, 55 | Llovizna | 🌦 |
| 56, 57 | Llovizna helada | 🌦❄️ |
| 61, 63, 65 | Lluvia | 🌧 |
| 66, 67 | Lluvia helada | 🌧❄️ |
| 71, 73, 75 | Nieve | ❄️ |
| 77 | Granizo | 🌨 |
| 80, 81, 82 | Lluvia intensa | 🌧 |
| 85, 86 | Nevada intensa | ❄️ |
| 95 | Tormenta eléctrica | ⛈ |
| 96, 99 | Tormenta con granizo | ⛈🧊 |

**Regla de mapeo**: Se usa el código más significativo del día. Para el widget, el código del `current`.

---

## 6. Lógica de Geolocalización

### 6.1 Permission Flow

```
App Launch
  ↓
Manifest: ACCESS_FINE_LOCATION + ACCESS_COARSE_LOCATION
  ↓
Runtime: checkSelfPermission()
  ├── Denied →
  │     Mostrar SearchScreen + snackbar "Activá GPS para clima automático"
  │     + botón "Configurar" que abre settings de permisos
  │
  └── Granted →
        FusedLocationClient.getCurrentLocation(PRIORITY_HIGH_ACCURACY, 5s timeout)
        Si timeout → fallback a PRIORITY_BALANCED_POWER_ACCURACY
```

### 6.2 LocationRequest (Adaptive Polling)

```kotlin
val locationRequest = LocationRequest.Builder(
    Priority.PRIORITY_HIGH_ACCURACY,
    300_000L        // 5 min por defecto
).apply {
    setMinUpdateIntervalMillis(60_000L)   // mínimo 1 min
    setMinUpdateDistanceMeters(500f)       // 500 m de cambio
}.build()
```

**Estrategia adaptativa**:

| Estado del usuario | Intervalo | Distancia mínima |
|--------------------|-----------|------------------|
| En movimiento (> 500m en 2 min) | 5 min | 500 m |
| Estático (< 500m en 30 min) | 15 min | 1000 m |
| App en background | 30 min | 2000 m |
| Widget actualiza | — | — (usa WorkManager) |

### 6.3 Reverse Geocoding

- Primer fetch: Open-Meteo Reverse Geocoding → `cityName`
- Cachear en DataStore: `lastCityName`
- Si el reverse falla: mostrar lat/lon como fallback

### 6.4 Movimiento Dinámico

- `callbackFlow` en LocationRepository emite cada cambio de ubicación
- Debounce de 10s para evitar fetchs en tránsito (auto/tren)
- Si `newLocation.distanceTo(lastLocation) < 500m` → ignorar
- Si cambió de ciudad (ej: salió de CABA a Zona Norte) → fetch completo + animación de transición

---

## 7. Cache y Offline

| Tipo | Estrategia | TTL |
|------|-----------|-----|
| Current weather | Stale-while-revalidate | 15 min |
| Daily forecast | Stale-while-revalidate | 1 hora |
| Hourly forecast | Stale-while-revalidate | 30 min |
| Air quality | Stale-while-revalidate | 1 hora |
| City name (geo) | Cache persistente | 24 horas |
| Favoritos | DataStore (siempre fresco) | — |
| Tema | DataStore (siempre fresco) | — |

**Implementación**:
- Cache en memoria: `MutableStateFlow<CacheState>()`
- Cache persistente: DataStore con JSON serializado
- Al abrir la app: mostrar cache inmediato → fetch en background → actualizar UI

---

## 8. Pantalla Principal — Layout

Scroll vertical único (como Apple Weather):

```
┌─────────────────────────────────┐
│ [←]  Buenos Aires, Argentina  [★]│  ← LocationHeader
│           ☀️  27°C               │  ← CurrentWeatherCard
│      Sensación: 25°C             │
│─────────────────────────────────│
│  H: 60%  Viento: 12 km/h  UV: 3  │  ← MetricsRow
│─────────────────────────────────│
│  Próximas horas                  │  ← HourlyForecastRow
│  [☀️25°] [🌤24°] [☁️22°] [🌧20°]  │     (scroll horizontal)
│─────────────────────────────────│
│  Pronóstico 14 días              │  ← DailyForecastList
│  Lun  ☀️  28°/20°                │     (scroll vertical)
│  Mar  🌤  26°/19°                │
│  Mié  ☁️  22°/17°                │
│  ...                             │
│─────────────────────────────────│
│  Calidad del Aire: 25 (Buena)    │  ← AirQualityCard
│─────────────────────────────────│
│  🌩 Alerta: Tormenta fuerte      │  ← AlertBanner (condicional)
└─────────────────────────────────┘
```

---

## 9. Widget (Glance)

### 9.1 Layout — Solo lo esencial

```
┌──────────────────────┐
│   ☀️  27°C           │
│   Buenos Aires       │
└──────────────────────┘
```

- **Tamaño**: 2x1 (compacto, recomendado)
- **Sin métricas extras**, sin sensación térmica, sin viento
- **Condición**: ícono WMO mapeado (sol, nube, lluvia, nieve, tormenta)
- **Sin fondo animado** (Glance no lo soporta bien)

### 9.2 Actualización

```kotlin
val updateRequest = PeriodicWorkRequestBuilder<WeatherWidgetWorker>(
    30, TimeUnit.MINUTES       // Mínimo permitido por Android
).setConstraints(
    Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .build()
).build()

WorkManager.getInstance(context)
    .enqueueUniquePeriodicWork(
        "weather_widget_update",
        ExistingPeriodicWorkPolicy.KEEP,
        updateRequest
    )
```

### 9.3 Estados del Widget

| Estado | Layout |
|--------|--------|
| Loading | Placeholder gris + shimmer |
| Data | Ícono + temp + ciudad |
| Error | "—°" + "Sin conexión" |
| No location | "📍 Abrir app para configurar" |

### 9.4 Touch

- Tap en widget → abre `MainActivity` con la ciudad actual

---

## 10. Air Quality (Open-Meteo)

Endpoint: `https://air-quality-api.open-meteo.com/v1/air-quality`

```kotlin
data class AirQualityDto(
    val current: CurrentAQI
)

data class CurrentAQI(
    val europeanAqi: Double?,       // "european_aqi"
    val usAqi: Double?,             // "us_aqi"
    val pm2_5: Double?,             // "pm2_5"
    val pm10: Double?,              // "pm10"
    val ozone: Double?              // "ozone"
)
```

**Visualización**: Índice numérico + color + etiqueta (Buena / Moderada / Dañina).

---

## 11. Alertas Meteorológicas

Endpoint: `https://api.open-meteo.com/v1/weather-alerts`

Se muestran como un banner en la home SOLO si hay alertas activas. Al tocar, expande detalle.

No guardar en cache — siempre fetch fresh al abrir la app.

---

## 12. Favoritos

- Guardar lista de `FavoriteCity(name, lat, lon)` en DataStore Proto
- UI: ViewPager horizontal swippeable entre ciudades favoritas
- Botón estrella en LocationHeader para agregar/quitar
- Al cambiar de ciudad via pager → fetch de clima + animación crossfade
- Si hay favoritos, al abrir la app arrancar en el último favorito visto

---

## 13. UI / Animaciones

| Elemento | Animación |
|----------|-----------|
| Cambio de ciudad | `AnimatedContent` + `slideInHorizontally` |
| Cambio de condición | Crossfade en ícono + background gradient |
| Carga inicial | Shimmer en todas las cards |
| Pull-to-refresh | Swipe-to-refresh estándar |
| Scroll | Scroll vertical nativo (LazyColumn) |
| Horas | Scroll horizontal + snap |
| Background | Gradient animado según condición (día/noche + clima) |

### Paleta de Colores

| Condición | Día | Noche |
|-----------|-----|-------|
| Despejado | #1565C0 → #64B5F6 | #0D1B2A → #1B2838 |
| Nublado | #455A64 → #90A4AE | #263238 → #37474F |
| Lluvia | #37474F → #546E7A | #1A237E → #283593 |
| Nieve | #ECEFF1 → #B0BEC5 | #263238 → #37474F |
| Tormenta | #311B92 → #4527A0 | #1A237E → #283593 |

---

## 14. Temas

- **Modo oscuro**: `isSystemInDarkTheme()` + preferencia manual en Settings
- **Dynamic Colors**: `dynamicLightColorScheme()` / `dynamicDarkColorScheme()` en Android 12+
- **Fallback**: Paleta manual en `Color.kt`

---

## 15. Settings

| Opción | Tipo | Default |
|--------|------|---------|
| Tema | Sistema / Claro / Oscuro | Sistema |
| Unidad de temperatura | °C / °F | °C |
| Intervalo de GPS | 5 min / 15 min / 30 min | 5 min |
| Acerca de | Link a GitHub | — |

---

## 16. Handling de Errores

| Escenario | Acción UI | Cache |
|-----------|-----------|-------|
| Sin conexión | Snackbar "Sin conexión" + icono offline en header | Mostrar cache |
| API timeout (5s) | Mostrar cache + indicador "datos no actualizados" | Mostrar cache |
| Ubicación denegada | SearchScreen + snackbar de permiso | Última ciudad conocida |
| GPS timeout | Fallback a última ubicación conocida | Última ciudad conocida |
| HTTP 429 (rate limit) | Esperar 60s + retry automático | Mostrar cache |
| Geocoding falla | Mostrar lat/lon como texto | Cache de ciudad |

---

## 17. Plan de Fases — Legión de Sub-agentes

| Fase | Agente | Artefactos | Depende de |
|------|--------|-----------|------------|
| **F0** | Init | Gradle project, módulos, dependencias, Application class | — |
| **F1** | Data API | WeatherApi, AirQualityApi, AlertApi, GeocodingApi, DTOs, Mappers | F0 |
| **F2** | Data Local | DataStore, PreferencesRepository, CacheManager | F0 |
| **F3** | Data Repo | WeatherRepositoryImpl, LocationRepositoryImpl, GeocodingRepositoryImpl, FavoritesRepositoryImpl | F1 + F2 |
| **F4** | Domain | Models, Repository interfaces | F0 |
| **F5** | Location | GPSTracker, permission handling, adaptive polling | F0 |
| **F6** | DI | NetworkModule, RepositoryModule, LocationModule | F3 + F4 + F5 |
| **F7** | Theme | Theme.kt, Color.kt, Type.kt, WeatherGradients.kt | F0 |
| **F8** | Home UI | HomeScreen, HomeViewModel, todos los componentes | F6 + F7 |
| **F9** | Search UI | SearchScreen, SearchViewModel | F6 + F7 |
| **F10** | Favorites UI | FavoritesScreen, FavoritesViewModel, CityPager | F6 + F7 |
| **F11** | Settings UI | SettingsScreen, SettingsViewModel | F6 + F7 |
| **F12** | Widget | WeatherWidget, WeatherWidgetReceiver, WeatherWidgetWorker, WidgetLayout | F3 |
| **F13** | Nexus | Integración final, navegación, edge cases | F8 + F9 + F10 + F11 + F12 |

---

## 18. Convenciones de Código

- **Idioma**: Código y comentarios en inglés. Strings de UI en español vía `strings.xml`.
- **Naming**: `camelCase` para variables/funciones, `PascalCase` para clases, `UPPER_SNAKE` para constantes.
- **Packaging**: por feature (home, search, favorites, settings) + capa (data, domain, ui).
- **ViewModel**: un StateFlow `UiState` sellado por pantalla.
- **Testing**: toda función pública de repositorios y ViewModels debe tener test.
- **Commits**: conventional commits (`feat:`, `fix:`, `refactor:`).

---

> **Fin del Spec. Este documento es la fuente de verdad para todas las fases.**
> Cualquier cambio en requerimientos debe actualizar este spec primero.
