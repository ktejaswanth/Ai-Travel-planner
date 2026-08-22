package com.tripwise.integrations.weather;

import com.tripwise.weather.dto.WeatherForecastDto;

import java.time.LocalDate;
import java.util.Map;

public interface OpenWeatherClient {

    WeatherForecastDto getWeatherForecast(String destination, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getCurrentWeather(String destination);
}
