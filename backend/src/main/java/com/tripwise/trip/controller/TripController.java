package com.tripwise.trip.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.trip.dto.CreateTripRequest;
import com.tripwise.trip.dto.TripResponse;
import com.tripwise.trip.dto.UpdateTripRequest;
import com.tripwise.trip.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@Tag(name = "Trips", description = "Trip management endpoints")
public class TripController {

    private final TripService tripService;

    @PostMapping
    @Operation(summary = "Create a new trip with preferences")
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(@AuthenticationPrincipal UserDetails userDetails,
                                                                @Valid @RequestBody CreateTripRequest request) {
        TripResponse response = tripService.createTrip(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all trips created by the authenticated user")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getUserTrips(@AuthenticationPrincipal UserDetails userDetails) {
        List<TripResponse> response = tripService.getUserTrips(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific trip by ID")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @PathVariable("id") String tripId) {
        TripResponse response = tripService.getTripById(tripId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Trip details retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing trip by ID")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(@AuthenticationPrincipal UserDetails userDetails,
                                                                @PathVariable("id") String tripId,
                                                                @Valid @RequestBody UpdateTripRequest request) {
        TripResponse response = tripService.updateTrip(tripId, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a trip by ID")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@AuthenticationPrincipal UserDetails userDetails,
                                                        @PathVariable("id") String tripId) {
        tripService.deleteTrip(tripId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully"));
    }
}
