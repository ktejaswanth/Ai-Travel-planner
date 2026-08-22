package com.tripwise.integrations.google;

import com.tripwise.integrations.google.dto.DistanceMatrixDto;
import com.tripwise.integrations.google.dto.RouteDto;

import java.util.List;
import java.util.Map;

public interface GoogleRoutesClient {
    
    RouteDto calculateRoute(String origin, String destination, String travelMode);

    DistanceMatrixDto getDistanceMatrix(List<String> origins, List<String> destinations, String travelMode);
}
