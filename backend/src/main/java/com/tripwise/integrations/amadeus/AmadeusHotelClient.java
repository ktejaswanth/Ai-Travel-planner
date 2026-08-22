package com.tripwise.integrations.amadeus;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AmadeusHotelClient {

    List<Map<String, Object>> searchHotelOffers(String cityCode, LocalDate checkInDate, LocalDate checkOutDate, int guests);
}
