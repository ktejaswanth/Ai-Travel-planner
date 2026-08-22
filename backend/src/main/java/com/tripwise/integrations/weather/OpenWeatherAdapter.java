package com.tripwise.integrations.weather;

import com.tripwise.integrations.config.IntegrationsProperties;
import com.tripwise.weather.dto.WeatherForecastDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Component
public class OpenWeatherAdapter implements OpenWeatherClient {

    private final IntegrationsProperties.WeatherProperties weatherProperties;
    private final RestTemplate restTemplate;

    public OpenWeatherAdapter(IntegrationsProperties properties, RestTemplateBuilder builder) {
        this.weatherProperties = properties.getWeather();
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public WeatherForecastDto getWeatherForecast(String destination, LocalDate startDate, LocalDate endDate) {
        String apiKey = weatherProperties.getOpenWeatherApiKey();

        if (apiKey == null || apiKey.isBlank()) {
            log.info("OPENWEATHER_API_KEY not configured. Returning curated forecast for destination: {}", destination);
            return getFallbackForecast(destination, startDate, endDate);
        }

        try {
            // Step 1: Geocode city name to lat/lon
            String geoUrl = String.format("https://api.openweathermap.org/geo/1.0/direct?q=%s&limit=1&appid=%s",
                    destination, apiKey);
            List<Map<String, Object>> geoList = restTemplate.getForObject(geoUrl, List.class);

            if (geoList != null && !geoList.isEmpty()) {
                Map<String, Object> first = geoList.get(0);
                double lat = ((Number) first.get("lat")).doubleValue();
                double lon = ((Number) first.get("lon")).doubleValue();

                // Step 2: Call 5-day / 3-hour forecast
                String forecastUrl = String.format(
                        "https://api.openweathermap.org/data/2.5/forecast?lat=%f&lon=%f&units=metric&appid=%s",
                        lat, lon, apiKey);

                Map<String, Object> forecastResponse = restTemplate.getForObject(forecastUrl, Map.class);
                if (forecastResponse != null && forecastResponse.containsKey("list")) {
                    List<Map<String, Object>> list = (List<Map<String, Object>>) forecastResponse.get("list");
                    return mapOpenWeatherListToForecast(destination, list, startDate, endDate);
                }
            }
        } catch (Exception e) {
            log.error("OpenWeather API call failed for {}: {}", destination, e.getMessage());
        }

        return getFallbackForecast(destination, startDate, endDate);
    }

    @Override
    public Map<String, Object> getCurrentWeather(String destination) {
        String apiKey = weatherProperties.getOpenWeatherApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            return Map.of("destination", destination, "temperature", 28.5, "condition", "Sunny", "humidity", 65);
        }

        try {
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s",
                    destination, apiKey);
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("OpenWeather current weather call failed for {}: {}", destination, e.getMessage());
            return Map.of("destination", destination, "temperature", 28.5, "condition", "Sunny", "humidity", 65);
        }
    }

    private WeatherForecastDto mapOpenWeatherListToForecast(
            String destination, List<Map<String, Object>> list, LocalDate startDate, LocalDate endDate) {
        
        Map<String, List<Map<String, Object>>> dayBuckets = new LinkedHashMap<>();
        for (Map<String, Object> item : list) {
            String dtTxt = (String) item.get("dt_txt"); // "2026-08-22 12:00:00"
            if (dtTxt != null && dtTxt.length() >= 10) {
                String dateStr = dtTxt.substring(0, 10);
                dayBuckets.computeIfAbsent(dateStr, k -> new ArrayList<>()).add(item);
            }
        }

        List<WeatherForecastDto.DailyWeatherDto> dailyList = new ArrayList<>();
        boolean alertActive = false;
        String alertMsg = null;

        for (Map.Entry<String, List<Map<String, Object>>> entry : dayBuckets.entrySet()) {
            List<Map<String, Object>> items = entry.getValue();
            double tempSum = 0;
            double minTemp = 100;
            double maxTemp = -100;
            double maxPop = 0;
            double windSpeed = 0;
            int humiditySum = 0;
            String condition = "Clear";
            String icon = "01d";

            for (Map<String, Object> it : items) {
                Map<String, Object> main = (Map<String, Object>) it.get("main");
                if (main != null) {
                    double t = ((Number) main.get("temp")).doubleValue();
                    tempSum += t;
                    minTemp = Math.min(minTemp, ((Number) main.get("temp_min")).doubleValue());
                    maxTemp = Math.max(maxTemp, ((Number) main.get("temp_max")).doubleValue());
                    humiditySum += ((Number) main.get("humidity")).intValue();
                }

                if (it.get("pop") instanceof Number) {
                    maxPop = Math.max(maxPop, ((Number) it.get("pop")).doubleValue());
                }

                if (it.get("wind") instanceof Map) {
                    Map<String, Object> wind = (Map<String, Object>) it.get("wind");
                    windSpeed = Math.max(windSpeed, ((Number) wind.get("speed")).doubleValue());
                }

                if (it.get("weather") instanceof List) {
                    List<Map<String, Object>> wList = (List<Map<String, Object>>) it.get("weather");
                    if (!wList.isEmpty()) {
                        condition = (String) wList.get(0).get("main");
                        icon = (String) wList.get(0).get("icon");
                    }
                }
            }

            int count = Math.max(1, items.size());
            double avgTemp = Math.round((tempSum / count) * 10.0) / 10.0;
            int avgHumidity = humiditySum / count;
            boolean outdoorOk = maxPop < 0.60 && windSpeed < 12.0;

            if (!outdoorOk && !alertActive) {
                alertActive = true;
                alertMsg = String.format("High chance of precipitation (%.0f%%) on %s. Consider indoor alternatives.", maxPop * 100, entry.getKey());
            }

            dailyList.add(WeatherForecastDto.DailyWeatherDto.builder()
                    .date(entry.getKey())
                    .temperature(avgTemp)
                    .tempMin(Math.round(minTemp * 10.0) / 10.0)
                    .tempMax(Math.round(maxTemp * 10.0) / 10.0)
                    .condition(condition)
                    .rainProbability(Math.round(maxPop * 100.0) / 100.0)
                    .windSpeed(Math.round(windSpeed * 10.0) / 10.0)
                    .humidity(avgHumidity)
                    .outdoorSuitable(outdoorOk)
                    .icon(icon)
                    .build());
        }

        double curTemp = dailyList.isEmpty() ? 28.0 : dailyList.get(0).getTemperature();
        String curCond = dailyList.isEmpty() ? "Sunny" : dailyList.get(0).getCondition();

        return WeatherForecastDto.builder()
                .destination(destination)
                .currentTemperature(curTemp)
                .currentCondition(curCond)
                .forecast(dailyList)
                .weatherAlertActive(alertActive)
                .alertDescription(alertMsg)
                .build();
    }

    private WeatherForecastDto getFallbackForecast(String destination, LocalDate startDate, LocalDate endDate) {
        LocalDate start = (startDate != null) ? startDate : LocalDate.now();
        int days = (endDate != null) ? Math.max(1, (int) Duration.between(start.atStartOfDay(), endDate.atStartOfDay()).toDays() + 1) : 5;
        if (days > 7) days = 7;

        List<WeatherForecastDto.DailyWeatherDto> forecast = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 0; i < days; i++) {
            LocalDate d = start.plusDays(i);
            boolean isDay3 = (i == 2);
            double temp = isDay3 ? 26.5 : 29.0 + (i % 2);
            String cond = isDay3 ? "Heavy Rain" : (i % 2 == 0 ? "Sunny" : "Partly Cloudy");
            double rainProb = isDay3 ? 0.85 : 0.10;
            boolean outdoor = !isDay3;

            forecast.add(WeatherForecastDto.DailyWeatherDto.builder()
                    .date(d.format(fmt))
                    .temperature(temp)
                    .tempMin(temp - 3.0)
                    .tempMax(temp + 3.0)
                    .condition(cond)
                    .rainProbability(rainProb)
                    .windSpeed(isDay3 ? 8.5 : 3.5)
                    .humidity(isDay3 ? 85 : 62)
                    .outdoorSuitable(outdoor)
                    .icon(isDay3 ? "10d" : "01d")
                    .build());
        }

        return WeatherForecastDto.builder()
                .destination(destination)
                .currentTemperature(29.0)
                .currentCondition("Sunny")
                .forecast(forecast)
                .weatherAlertActive(days >= 3)
                .alertDescription("Heavy rain forecasted for Day 3. Moving outdoor activities indoors is recommended.")
                .build();
    }
}
