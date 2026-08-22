package com.tripwise.flight.service;

import com.tripwise.flight.dto.FlightOfferDto;
import com.tripwise.integrations.amadeus.AmadeusFlightClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightService {

    private final AmadeusFlightClient amadeusFlightClient;

    public List<FlightOfferDto> searchFlights(
            String origin, String destination, LocalDate departureDate, LocalDate returnDate, int adults) {
        return amadeusFlightClient.searchFlightOffers(origin, destination, departureDate, returnDate, adults);
    }
}
