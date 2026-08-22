package com.tripwise.itinerary.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.itinerary.dto.ItineraryResponse;
import com.tripwise.itinerary.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}")
@RequiredArgsConstructor
@Tag(name = "Itinerary & AI Planning", description = "AI itinerary generation and price-grounded schedule endpoints")
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate-itinerary")
    @Operation(summary = "Generate a price-grounded AI itinerary for a trip")
    public ResponseEntity<ApiResponse<ItineraryResponse>> generateItinerary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("tripId") String tripId) {
        ItineraryResponse response = itineraryService.generateItinerary(tripId, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AI Itinerary and budget plan generated successfully", response));
    }

    @GetMapping("/itinerary")
    @Operation(summary = "Get the generated itinerary and budget breakdown for a trip")
    public ResponseEntity<ApiResponse<ItineraryResponse>> getItinerary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("tripId") String tripId) {
        ItineraryResponse response = itineraryService.getItinerary(tripId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Itinerary retrieved successfully", response));
    }
}
