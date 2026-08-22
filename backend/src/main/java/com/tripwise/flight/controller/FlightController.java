package com.tripwise.flight.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.flight.dto.FlightOfferDto;
import com.tripwise.flight.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@Tag(name = "Flights", description = "Amadeus Flight search & live price endpoints")
public class FlightController {

    private final FlightService flightService;

    @GetMapping("/search")
    @Operation(summary = "Search flight offers between origin and destination")
    public ResponseEntity<ApiResponse<List<FlightOfferDto>>> searchFlights(
            @RequestParam("origin") String origin,
            @RequestParam("destination") String destination,
            @RequestParam(value = "departureDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(value = "returnDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate,
            @RequestParam(value = "adults", defaultValue = "1") int adults) {
        List<FlightOfferDto> flights = flightService.searchFlights(origin, destination, departureDate, returnDate, adults);
        return ResponseEntity.ok(ApiResponse.success("Flight offers retrieved successfully", flights));
    }
}
