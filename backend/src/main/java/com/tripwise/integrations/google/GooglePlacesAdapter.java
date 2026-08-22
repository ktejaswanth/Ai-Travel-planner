package com.tripwise.integrations.google;

import com.tripwise.integrations.config.IntegrationsProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Slf4j
@Component
public class GooglePlacesAdapter implements GooglePlacesClient {

    private final IntegrationsProperties.GoogleProperties googleProperties;
    private final RestTemplate restTemplate;

    public GooglePlacesAdapter(IntegrationsProperties properties, RestTemplateBuilder builder) {
        this.googleProperties = properties.getGoogle();
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public List<Map<String, Object>> searchPlaces(String query, String location, int radiusMeters) {
        String apiKey = googleProperties.getPlacesApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = googleProperties.getMapsApiKey();
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.info("GOOGLE_PLACES_API_KEY not provided. Returning curated mock places for query: {}", query);
            return getMockPlaces(query);
        }

        try {
            String url = String.format("https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s&key=%s",
                    query, apiKey);
            if (location != null && !location.isBlank()) {
                url += "&location=" + location + "&radius=" + radiusMeters;
            }

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && "OK".equals(response.get("status")) && response.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                if (results != null && !results.isEmpty()) {
                    return results;
                }
            }
        } catch (Exception e) {
            log.error("Google Places API call failed for query {}: {}", query, e.getMessage());
        }

        return getMockPlaces(query);
    }

    @Override
    public Map<String, Object> getPlaceDetails(String placeId) {
        String apiKey = googleProperties.getPlacesApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = googleProperties.getMapsApiKey();
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.info("GOOGLE_PLACES_API_KEY not provided. Returning mock details for placeId: {}", placeId);
            return getMockPlaceDetails(placeId);
        }

        try {
            String url = String.format("https://maps.googleapis.com/maps/api/place/details/json?placeid=%s&key=%s",
                    placeId, apiKey);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && "OK".equals(response.get("status")) && response.containsKey("result")) {
                return (Map<String, Object>) response.get("result");
            }
        } catch (Exception e) {
            log.error("Google Place Details call failed for placeId {}: {}", placeId, e.getMessage());
        }

        return getMockPlaceDetails(placeId);
    }

    private List<Map<String, Object>> getMockPlaces(String query) {
        List<Map<String, Object>> places = new ArrayList<>();

        Map<String, Object> place1 = new HashMap<>();
        place1.put("place_id", "mock_place_1");
        place1.put("name", "Baga Beach");
        place1.put("formatted_address", "Baga, Bardez, Goa 403516, India");
        place1.put("rating", 4.6);
        place1.put("user_ratings_total", 12450);
        place1.put("types", List.of("tourist_attraction", "point_of_interest", "establishment"));
        Map<String, Object> location1 = Map.of("lat", 15.5553, "lng", 73.7517);
        place1.put("geometry", Map.of("location", location1));

        Map<String, Object> place2 = new HashMap<>();
        place2.put("place_id", "mock_place_2");
        place2.put("name", "Aguada Fort");
        place2.put("formatted_address", "Sinquerim, Candolim, Goa 403515, India");
        place2.put("rating", 4.5);
        place2.put("user_ratings_total", 8920);
        place2.put("types", List.of("tourist_attraction", "historical_landmark"));
        Map<String, Object> location2 = Map.of("lat", 15.4926, "lng", 73.7737);
        place2.put("geometry", Map.of("location", location2));

        places.add(place1);
        places.add(place2);
        return places;
    }

    private Map<String, Object> getMockPlaceDetails(String placeId) {
        Map<String, Object> place = new HashMap<>();
        place.put("place_id", placeId);
        place.put("name", "Baga Beach Resort & Watersports");
        place.put("formatted_address", "Baga, Calangute, Goa 403516, India");
        place.put("rating", 4.7);
        place.put("user_ratings_total", 15400);
        place.put("types", List.of("tourist_attraction", "lodging", "restaurant"));
        place.put("geometry", Map.of("location", Map.of("lat", 15.5553, "lng", 73.7517)));
        return place;
    }
}
