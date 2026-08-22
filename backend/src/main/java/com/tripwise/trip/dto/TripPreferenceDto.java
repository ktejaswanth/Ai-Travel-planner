package com.tripwise.trip.dto;

import com.tripwise.trip.model.Interest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripPreferenceDto {

    private List<Interest> interests;
    private String travelStyle;
    private String pace;
    private String accommodationPreference;
    private String transportPreference;
    private String dietaryPreference;
    private String specialRequirements;
}
