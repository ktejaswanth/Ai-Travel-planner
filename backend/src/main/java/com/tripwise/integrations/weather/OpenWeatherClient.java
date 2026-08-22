package com.tripwise.integrations.weather;

import java.time.LocalDate;
import java.util.Map;

public interface OpenWeatherClient {

    Map<String, Object> getWeatherForecast(String destination, LocalDate startDate, LocalDate endDate);
}
