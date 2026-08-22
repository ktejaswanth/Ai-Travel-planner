package com.tripwise.weather.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.weather.dto.WeatherForecastDto;
import com.tripwise.weather.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "OpenWeather forecast & weather notice endpoints")
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping
    @Operation(summary = "Get weather forecast and rain probability for a destination")
    public ResponseEntity<ApiResponse<WeatherForecastDto>> getWeather(
            @RequestParam("destination") String destination,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        WeatherForecastDto forecast = weatherService.getWeatherForecast(destination, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Weather forecast retrieved successfully", forecast));
    }
}
