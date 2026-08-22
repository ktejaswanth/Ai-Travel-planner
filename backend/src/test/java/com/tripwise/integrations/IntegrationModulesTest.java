package com.tripwise.integrations;

import com.tripwise.ai.dto.AiChatRequestDto;
import com.tripwise.ai.dto.AiChatResponseDto;
import com.tripwise.ai.dto.AiReplanRequestDto;
import com.tripwise.ai.dto.AiReplanResponseDto;
import com.tripwise.ai.security.PromptSanitizer;
import com.tripwise.ai.service.AiService;
import com.tripwise.ai.validator.AiResponseValidator;
import com.tripwise.common.dto.ApiResponse;
import com.tripwise.flight.dto.FlightOfferDto;
import com.tripwise.hotel.dto.HotelOfferDto;
import com.tripwise.integrations.amadeus.AmadeusAuthService;
import com.tripwise.integrations.amadeus.AmadeusFlightAdapter;
import com.tripwise.integrations.amadeus.AmadeusHotelAdapter;
import com.tripwise.integrations.config.IntegrationsProperties;
import com.tripwise.integrations.gemini.GeminiAdapter;
import com.tripwise.integrations.google.GooglePlacesAdapter;
import com.tripwise.integrations.google.GoogleRoutesAdapter;
import com.tripwise.integrations.google.dto.DistanceMatrixDto;
import com.tripwise.integrations.google.dto.RouteDto;
import com.tripwise.integrations.health.IntegrationHealthController;
import com.tripwise.integrations.weather.OpenWeatherAdapter;
import com.tripwise.weather.dto.WeatherForecastDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class IntegrationModulesTest {

    private IntegrationsProperties properties;
    private RestTemplateBuilder restTemplateBuilder;
    private PromptSanitizer promptSanitizer;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        properties = new IntegrationsProperties();
        properties.getGoogle().setMapsApiKey("AIzaSyFakeGoogleKeyForTesting12345");
        properties.getGoogle().setPlacesApiKey("AIzaSyFakeGoogleKeyForTesting12345");
        properties.getWeather().setOpenWeatherApiKey("fake_weather_key_12345");
        properties.getAmadeus().setClientId("fake_client_id");
        properties.getAmadeus().setClientSecret("fake_client_secret");
        properties.getGemini().setApiKey("fake_gemini_key");

        restTemplateBuilder = new RestTemplateBuilder();
        promptSanitizer = new PromptSanitizer();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("1. Google Routes: should calculate fallback route and distance matrix cleanly")
    void testGoogleRoutes() {
        GoogleRoutesAdapter adapter = new GoogleRoutesAdapter(properties, restTemplateBuilder);
        RouteDto route = adapter.calculateRoute("Baga Beach", "Aguada Fort", "driving");

        assertNotNull(route);
        assertEquals("Baga Beach", route.getOrigin());
        assertEquals("Aguada Fort", route.getDestination());
        assertTrue(route.getDistanceKm() > 0);
        assertTrue(route.getDurationMinutes() > 0);

        DistanceMatrixDto matrix = adapter.getDistanceMatrix(List.of("Baga Beach"), List.of("Aguada Fort"), "driving");
        assertNotNull(matrix);
        assertEquals(1, matrix.getRows().size());
    }

    @Test
    @DisplayName("2. Google Places: should return search results and place details")
    void testGooglePlaces() {
        GooglePlacesAdapter adapter = new GooglePlacesAdapter(properties, restTemplateBuilder);
        List<Map<String, Object>> places = adapter.searchPlaces("Beaches in Goa", "15.55,73.75", 5000);

        assertNotNull(places);
        assertFalse(places.isEmpty());

        Map<String, Object> details = adapter.getPlaceDetails("mock_place_1");
        assertNotNull(details);
        assertTrue(details.containsKey("name"));
    }

    @Test
    @DisplayName("3. OpenWeather: should parse 5-day forecast, rain probabilities and outdoor suitability")
    void testOpenWeather() {
        OpenWeatherAdapter adapter = new OpenWeatherAdapter(properties, restTemplateBuilder);
        WeatherForecastDto forecast = adapter.getWeatherForecast("Goa", LocalDate.now(), LocalDate.now().plusDays(4));

        assertNotNull(forecast);
        assertEquals("Goa", forecast.getDestination());
        assertFalse(forecast.getForecast().isEmpty());
        assertTrue(forecast.getCurrentTemperature() > 0);
        assertNotNull(forecast.getForecast().get(0).getCondition());
    }

    @Test
    @DisplayName("4. Amadeus Flights: should return flight offers with pricing and airline details")
    void testAmadeusFlights() {
        AmadeusAuthService authService = new AmadeusAuthService(properties, restTemplateBuilder);
        AmadeusFlightAdapter adapter = new AmadeusFlightAdapter(properties, authService, restTemplateBuilder);

        List<FlightOfferDto> flights = adapter.searchFlightOffers("HYD", "GOI", LocalDate.now().plusDays(7), null, 1);
        assertNotNull(flights);
        assertFalse(flights.isEmpty());
        assertEquals("HYD", flights.get(0).getOrigin());
        assertEquals("GOI", flights.get(0).getDestination());
        assertTrue(flights.get(0).getPrice() > 0);
    }

    @Test
    @DisplayName("5. Amadeus Hotels: should return hotel offers with amenities and per-night rates")
    void testAmadeusHotels() {
        AmadeusAuthService authService = new AmadeusAuthService(properties, restTemplateBuilder);
        AmadeusHotelAdapter adapter = new AmadeusHotelAdapter(properties, authService, restTemplateBuilder);

        List<HotelOfferDto> hotels = adapter.searchHotelOffers("GOI", LocalDate.now().plusDays(7), LocalDate.now().plusDays(10), 2);
        assertNotNull(hotels);
        assertFalse(hotels.isEmpty());
        assertTrue(hotels.get(0).getPricePerNight() > 0);
        assertNotNull(hotels.get(0).getName());
    }

    @Test
    @DisplayName("6. Gemini AI: Prompt Sanitization and Adaptive Replanning comparisons")
    void testGeminiAI() {
        GeminiAdapter adapter = new GeminiAdapter(properties, restTemplateBuilder, promptSanitizer, objectMapper);
        AiService aiService = new AiService(adapter, promptSanitizer);

        AiChatResponseDto chat = aiService.chat(AiChatRequestDto.builder()
                .tripId("trip_123")
                .message("Make Day 3 more relaxed please")
                .build());
        assertNotNull(chat);
        assertNotNull(chat.getResponse());

        AiReplanResponseDto replan = aiService.generateAdaptiveReplan(AiReplanRequestDto.builder()
                .tripId("trip_123")
                .dayNumber(3)
                .reason("WEATHER_RAIN")
                .build());
        assertNotNull(replan);
        assertEquals(3, replan.getDayNumber());
        assertTrue(replan.isSafetyConfirmed());
        assertEquals(-450.0, replan.getCostDelta());

        AiResponseValidator validator = new AiResponseValidator(objectMapper);
        assertTrue(validator.isValidJson("{\"days\": [{\"dayNumber\": 1}]}"));
    }

    @Test
    @DisplayName("7. Integrations Health Check: /api/integrations/health diagnostic")
    void testIntegrationsHealth() {
        IntegrationHealthController healthController = new IntegrationHealthController(properties);
        ResponseEntity<ApiResponse<Map<String, String>>> resp = healthController.getIntegrationsHealth();

        assertNotNull(resp.getBody());
        Map<String, String> data = resp.getBody().getData();
        assertEquals("CONFIGURED", data.get("googleMaps"));
        assertEquals("CONFIGURED", data.get("googlePlaces"));
        assertEquals("CONFIGURED", data.get("openWeather"));
        assertEquals("CONFIGURED", data.get("amadeus"));
        assertEquals("CONFIGURED", data.get("gemini"));
    }
}
