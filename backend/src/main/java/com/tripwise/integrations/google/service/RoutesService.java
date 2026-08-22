package com.tripwise.integrations.google.service;

import com.tripwise.integrations.google.GoogleRoutesClient;
import com.tripwise.integrations.google.dto.DistanceMatrixDto;
import com.tripwise.integrations.google.dto.RouteDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoutesService {

    private final GoogleRoutesClient googleRoutesClient;

    public RouteDto calculateRoute(String origin, String destination, String travelMode) {
        return googleRoutesClient.calculateRoute(origin, destination, travelMode);
    }

    public DistanceMatrixDto getDistanceMatrix(List<String> origins, List<String> destinations, String travelMode) {
        return googleRoutesClient.getDistanceMatrix(origins, destinations, travelMode);
    }
}
