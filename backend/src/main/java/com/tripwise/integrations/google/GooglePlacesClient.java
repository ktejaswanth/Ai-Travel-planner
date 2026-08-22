package com.tripwise.integrations.google;

import java.util.List;
import java.util.Map;

public interface GooglePlacesClient {
    
    List<Map<String, Object>> searchPlaces(String query, String location, int radiusMeters);

    Map<String, Object> getPlaceDetails(String placeId);
}
