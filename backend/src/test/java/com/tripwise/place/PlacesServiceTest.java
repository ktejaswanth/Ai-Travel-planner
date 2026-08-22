package com.tripwise.place;

import com.tripwise.integrations.google.GooglePlacesClient;
import com.tripwise.place.dto.PlaceDto;
import com.tripwise.place.repository.SavedPlaceRepository;
import com.tripwise.place.service.PlacesService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlacesServiceTest {

    @Mock
    private GooglePlacesClient googlePlacesClient;

    @Mock
    private SavedPlaceRepository savedPlaceRepository;

    @InjectMocks
    private PlacesService placesService;

    @Test
    @DisplayName("Should successfully search and normalize places")
    void searchPlaces_Success() {
        Map<String, Object> rawPlace = Map.of(
                "place_id", "ch_123",
                "name", "Goa Fort",
                "formatted_address", "Goa, India",
                "rating", 4.5,
                "user_ratings_total", 500,
                "types", List.of("tourist_attraction")
        );

        when(googlePlacesClient.searchPlaces("forts in Goa", "Goa", 5000)).thenReturn(List.of(rawPlace));

        List<PlaceDto> results = placesService.searchPlaces("forts in Goa", "Goa", 5000);

        assertEquals(1, results.size());
        assertEquals("ch_123", results.get(0).getPlaceId());
        assertEquals("Goa Fort", results.get(0).getName());
        assertEquals(4.5, results.get(0).getRating());
    }
}
