package com.tripwise.integrations.amadeus;

import com.tripwise.flight.dto.FlightOfferDto;

import java.time.LocalDate;
import java.util.List;

public interface AmadeusFlightClient {

    List<FlightOfferDto> searchFlightOffers(String origin, String destination, LocalDate departureDate, LocalDate returnDate, int adults);
}
