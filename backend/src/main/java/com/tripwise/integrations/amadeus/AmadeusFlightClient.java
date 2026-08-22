package com.tripwise.integrations.amadeus;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AmadeusFlightClient {

    List<Map<String, Object>> searchFlightOffers(String origin, String destination, LocalDate departureDate, LocalDate returnDate, int adults);
}
