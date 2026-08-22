package com.tripwise.weather.service;

import com.tripwise.integrations.weather.OpenWeatherClient;
import com.tripwise.weather.dto.WeatherForecastDto;
import com.tripwise.weather.model.WeatherSnapshot;
import com.tripwise.weather.repository.WeatherSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherService {

    private final OpenWeatherClient openWeatherClient;
    private final WeatherSnapshotRepository weatherSnapshotRepository;

    public WeatherForecastDto getWeatherForecast(String destination, LocalDate startDate, LocalDate endDate) {
        WeatherForecastDto forecast = openWeatherClient.getWeatherForecast(destination, startDate, endDate);
        
        // Cache weather snapshot in MongoDB
        try {
            WeatherSnapshot snapshot = WeatherSnapshot.builder()
                    .destination(destination)
                    .date(startDate != null ? startDate : LocalDate.now())
                    .temperature(forecast.getCurrentTemperature())
                    .condition(forecast.getCurrentCondition())
                    .build();
            weatherSnapshotRepository.save(snapshot);
        } catch (Exception e) {
            log.warn("Failed to persist weather snapshot to MongoDB: {}", e.getMessage());
        }

        return forecast;
    }

    public Map<String, Object> getCurrentWeather(String destination) {
        return openWeatherClient.getCurrentWeather(destination);
    }
}
