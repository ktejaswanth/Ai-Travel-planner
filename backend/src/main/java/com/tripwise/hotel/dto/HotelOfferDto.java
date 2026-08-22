package com.tripwise.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelOfferDto {
    private String id;
    private String hotelId;
    private String name;
    private String cityCode;
    private double rating;
    private String address;
    private double pricePerNight;
    private double totalPrice;
    private String currency;
    private String roomType;
    private String bedType;
    private List<String> amenities;
    private String photoUrl;
    private boolean breakfastIncluded;
}
