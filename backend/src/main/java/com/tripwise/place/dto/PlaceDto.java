package com.tripwise.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {

    private String placeId;
    private String name;
    private String address;
    private Double rating;
    private Integer userRatingsTotal;
    private Double latitude;
    private Double longitude;
    private List<String> types;
    private String photoUrl;
    private String priceLevel;
}
