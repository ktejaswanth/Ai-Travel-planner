package com.tripwise.hotel.controller;

import com.tripwise.common.dto.ApiResponse;
import com.tripwise.hotel.dto.HotelOfferDto;
import com.tripwise.hotel.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Tag(name = "Hotels", description = "Amadeus Hotel search & rate endpoints")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping("/search")
    @Operation(summary = "Search hotel offers in a destination city")
    public ResponseEntity<ApiResponse<List<HotelOfferDto>>> searchHotels(
            @RequestParam("cityCode") String cityCode,
            @RequestParam(value = "checkInDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam(value = "checkOutDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(value = "guests", defaultValue = "1") int guests) {
        List<HotelOfferDto> hotels = hotelService.searchHotels(cityCode, checkInDate, checkOutDate, guests);
        return ResponseEntity.ok(ApiResponse.success("Hotel offers retrieved successfully", hotels));
    }
}
