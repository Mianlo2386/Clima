package com.weatherflow.app.domain.model

enum class WeatherCondition(val wmoCode: IntRange) {
    CLEAR(0..0),
    MOSTLY_CLEAR(1..1),
    PARTLY_CLOUDY(2..2),
    OVERCAST(3..3),
    FOG(45..48),
    DRIZZLE(51..57),
    RAIN(61..67),
    SNOW(71..77),
    RAIN_SHOWER(80..82),
    SNOW_SHOWER(85..86),
    THUNDERSTORM(95..95),
    THUNDERSTORM_HAIL(96..99),
    UNKNOWN(IntRange.EMPTY);

    companion object {
        fun fromWmo(code: Int): WeatherCondition =
            entries.find { code in it.wmoCode } ?: UNKNOWN
    }
}
