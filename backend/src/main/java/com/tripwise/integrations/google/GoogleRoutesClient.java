package com.tripwise.integrations.google;

import java.util.Map;

public interface GoogleRoutesClient {
    
    Map<String, Object> calculateRoute(String origin, String destination, String travelMode);
}
