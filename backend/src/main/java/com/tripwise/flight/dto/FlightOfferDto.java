package com.tripwise.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightOfferDto {
    private String id;
    private String airlineCode;
    private String airlineName;
    private String flightNumber;
    private String origin;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private int numberOfStops;
    private double price;
    private String currency;
    private int availableSeats;
    private String cabinClass;
}
