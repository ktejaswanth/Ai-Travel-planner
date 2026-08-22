package com.tripwise.place.service;

import com.tripwise.integrations.google.GooglePlacesClient;
import com.tripwise.place.dto.PlaceDto;
import com.tripwise.place.model.SavedPlace;
import com.tripwise.place.repository.SavedPlaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlacesService {

    private final GooglePlacesClient googlePlacesClient;
    private final SavedPlaceRepository savedPlaceRepository;

    public List<PlaceDto> searchPlaces(String query, String location, int radiusMeters) {
        List<Map<String, Object>> rawResults = googlePlacesClient.searchPlaces(query, location, radiusMeters);
        return rawResults.stream()
                .map(this::normalizePlace)
                .collect(Collectors.toList());
    }

    public PlaceDto getPlaceDetails(String placeId) {
        // Check local saved place cache first
        return savedPlaceRepository.findByPlaceId(placeId)
                .map(this::mapSavedPlaceToDto)
                .orElseGet(() -> {
                    Map<String, Object> rawResult = googlePlacesClient.getPlaceDetails(placeId);
                    PlaceDto normalized = normalizePlace(rawResult);
                    savePlaceToDb(normalized);
                    return normalized;
                });
    }

    public List<PlaceDto> searchNearby(String location, String type, int radiusMeters) {
        String searchQuery = (type != null && !type.isBlank()) ? type + " in " + location : "attractions in " + location;
        return searchPlaces(searchQuery, location, radiusMeters);
    }

    private PlaceDto normalizePlace(Map<String, Object> raw) {
        String placeId = (String) raw.getOrDefault("place_id", UUID.randomUUID().toString());
        String name = (String) raw.getOrDefault("name", "Unknown Place");
        String address = (String) raw.getOrDefault("formatted_address", (String) raw.get("vicinity"));
        Double rating = raw.get("rating") instanceof Number ? ((Number) raw.get("rating")).doubleValue() : 4.0;
        Integer userRatingsTotal = raw.get("user_ratings_total") instanceof Number ? ((Number) raw.get("user_ratings_total")).intValue() : 0;
        List<String> types = raw.get("types") instanceof List ? (List<String>) raw.get("types") : List.of("point_of_interest");

        Double lat = 0.0;
        Double lng = 0.0;
        if (raw.get("geometry") instanceof Map) {
            Map<String, Object> geometry = (Map<String, Object>) raw.get("geometry");
            if (geometry.get("location") instanceof Map) {
                Map<String, Object> loc = (Map<String, Object>) geometry.get("location");
                lat = loc.get("lat") instanceof Number ? ((Number) loc.get("lat")).doubleValue() : 0.0;
                lng = loc.get("lng") instanceof Number ? ((Number) loc.get("lng")).doubleValue() : 0.0;
            }
        }

        return PlaceDto.builder()
                .placeId(placeId)
                .name(name)
                .address(address != null ? address : "Location details available on map")
                .rating(rating)
                .userRatingsTotal(userRatingsTotal)
                .latitude(lat)
                .longitude(lng)
                .types(types)
                .build();
    }

    private void savePlaceToDb(PlaceDto dto) {
        if (!savedPlaceRepository.existsByPlaceId(dto.getPlaceId())) {
            SavedPlace place = SavedPlace.builder()
                    .placeId(dto.getPlaceId())
                    .name(dto.getName())
                    .formattedAddress(dto.getAddress())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .rating(dto.getRating())
                    .userRatingsTotal(dto.getUserRatingsTotal())
                    .types(dto.getTypes())
                    .photoUrl(dto.getPhotoUrl())
                    .build();
            savedPlaceRepository.save(place);
        }
    }

    private PlaceDto mapSavedPlaceToDto(SavedPlace place) {
        return PlaceDto.builder()
                .placeId(place.getPlaceId())
                .name(place.getName())
                .address(place.getFormattedAddress())
                .rating(place.getRating())
                .userRatingsTotal(place.getUserRatingsTotal())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .types(place.getTypes())
                .photoUrl(place.getPhotoUrl())
                .build();
    }
}
