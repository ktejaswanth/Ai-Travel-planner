package com.tripwise.place.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.place.dto.PlaceDto;
import com.tripwise.place.service.PlacesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@Tag(name = "Places", description = "Google Places search & details endpoints")
public class PlacesController {

    private final PlacesService placesService;

    @GetMapping("/search")
    @Operation(summary = "Search places by query and location")
    public ResponseEntity<ApiResponse<List<PlaceDto>>> searchPlaces(
            @RequestParam("query") String query,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "radius", defaultValue = "5000") int radius) {
        List<PlaceDto> places = placesService.searchPlaces(query, location, radius);
        return ResponseEntity.ok(ApiResponse.success("Places retrieved successfully", places));
    }

    @GetMapping("/{placeId}")
    @Operation(summary = "Get detailed information for a specific place by placeId")
    public ResponseEntity<ApiResponse<PlaceDto>> getPlaceDetails(@PathVariable("placeId") String placeId) {
        PlaceDto place = placesService.getPlaceDetails(placeId);
        return ResponseEntity.ok(ApiResponse.success("Place details retrieved successfully", place));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Search nearby attractions, restaurants, and landmarks")
    public ResponseEntity<ApiResponse<List<PlaceDto>>> searchNearby(
            @RequestParam("location") String location,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "radius", defaultValue = "5000") int radius) {
        List<PlaceDto> places = placesService.searchNearby(location, type, radius);
        return ResponseEntity.ok(ApiResponse.success("Nearby places retrieved successfully", places));
    }
}
