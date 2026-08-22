package com.tripwise.integrations.amadeus;

import com.tripwise.hotel.dto.HotelOfferDto;

import java.time.LocalDate;
import java.util.List;

public interface AmadeusHotelClient {

    List<HotelOfferDto> searchHotelOffers(String cityCode, LocalDate checkInDate, LocalDate checkOutDate, int guests);
}
