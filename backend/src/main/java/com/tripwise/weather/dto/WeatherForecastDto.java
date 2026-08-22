package com.tripwise.weather.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherForecastDto {
    private String destination;
    private double currentTemperature;
    private String currentCondition;
    private List<DailyWeatherDto> forecast;
    private boolean weatherAlertActive;
    private String alertDescription;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyWeatherDto {
        private String date;
        private double temperature;
        private double tempMin;
        private double tempMax;
        private String condition;
        private double rainProbability; // 0.0 to 1.0 (or percentage)
        private double windSpeed; // m/s or km/h
        private int humidity;
        private boolean outdoorSuitable;
        private String icon;
    }
}
