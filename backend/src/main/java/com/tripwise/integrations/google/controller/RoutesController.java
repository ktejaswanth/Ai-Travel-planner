package com.tripwise.integrations.google.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.integrations.google.dto.DistanceMatrixDto;
import com.tripwise.integrations.google.dto.RouteDto;
import com.tripwise.integrations.google.service.RoutesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Routes & Navigation", description = "Google Routes & Distance Matrix endpoints")
public class RoutesController {

    private final RoutesService routesService;

    @GetMapping("/calculate")
    @Operation(summary = "Calculate route, duration, distance, and directions between origin and destination")
    public ResponseEntity<ApiResponse<RouteDto>> calculateRoute(
            @RequestParam("origin") String origin,
            @RequestParam("destination") String destination,
            @RequestParam(value = "travelMode", defaultValue = "driving") String travelMode) {
        RouteDto route = routesService.calculateRoute(origin, destination, travelMode);
        return ResponseEntity.ok(ApiResponse.success("Route calculated successfully", route));
    }

    @GetMapping("/matrix")
    @Operation(summary = "Calculate distance matrix between multiple origins and destinations")
    public ResponseEntity<ApiResponse<DistanceMatrixDto>> getDistanceMatrix(
            @RequestParam("origins") List<String> origins,
            @RequestParam("destinations") List<String> destinations,
            @RequestParam(value = "travelMode", defaultValue = "driving") String travelMode) {
        DistanceMatrixDto matrix = routesService.getDistanceMatrix(origins, destinations, travelMode);
        return ResponseEntity.ok(ApiResponse.success("Distance matrix calculated successfully", matrix));
    }
}
