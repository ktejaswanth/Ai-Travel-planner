package com.tripwise.integrations.health;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.integrations.config.IntegrationsProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
@RequiredArgsConstructor
@Tag(name = "Integrations Health", description = "Diagnostic status check for all external API providers")
public class IntegrationHealthController {

    private final IntegrationsProperties integrationsProperties;

    @GetMapping("/health")
    @Operation(summary = "Check configuration status of all external API provider integrations")
    public ResponseEntity<ApiResponse<Map<String, String>>> getIntegrationsHealth() {
        Map<String, String> health = new LinkedHashMap<>();

        // 1. Google Maps
        String mapsKey = integrationsProperties.getGoogle().getMapsApiKey();
        health.put("googleMaps", (mapsKey != null && !mapsKey.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");

        // 2. Google Places
        String placesKey = integrationsProperties.getGoogle().getPlacesApiKey();
        if (placesKey == null || placesKey.isBlank()) placesKey = mapsKey;
        health.put("googlePlaces", (placesKey != null && !placesKey.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");

        // 3. OpenWeather
        String weatherKey = integrationsProperties.getWeather().getOpenWeatherApiKey();
        health.put("openWeather", (weatherKey != null && !weatherKey.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");

        // 4. Flights (Aviationstack or Amadeus)
        String aviationKey = integrationsProperties.getAviationstack().getApiKey();
        String amadeusClientId = integrationsProperties.getAmadeus().getClientId();
        boolean flightsConfigured = (aviationKey != null && !aviationKey.isBlank()) || (amadeusClientId != null && !amadeusClientId.isBlank());
        health.put("flights", flightsConfigured ? "CONFIGURED" : "NOT_CONFIGURED");
        health.put("aviationstack", (aviationKey != null && !aviationKey.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");
        health.put("amadeus", (amadeusClientId != null && !amadeusClientId.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");

        // 5. Gemini AI
        String geminiKey = integrationsProperties.getGemini().getApiKey();
        health.put("gemini", (geminiKey != null && !geminiKey.isBlank()) ? "CONFIGURED" : "NOT_CONFIGURED");

        return ResponseEntity.ok(ApiResponse.success("Integrations health status retrieved", health));
    }
}
