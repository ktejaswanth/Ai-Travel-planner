package com.tripwise.hotel.service;

import com.tripwise.hotel.dto.HotelOfferDto;
import com.tripwise.integrations.amadeus.AmadeusHotelClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelService {

    private final AmadeusHotelClient amadeusHotelClient;

    public List<HotelOfferDto> searchHotels(String cityCode, LocalDate checkInDate, LocalDate checkOutDate, int guests) {
        return amadeusHotelClient.searchHotelOffers(cityCode, checkInDate, checkOutDate, guests);
    }
}
