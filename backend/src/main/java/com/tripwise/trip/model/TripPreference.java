package com.tripwise.trip.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trip_preferences")
public class TripPreference {

    @Id
    private String id;

    @Indexed(unique = true)
    private String tripId;

    @Builder.Default
    private List<Interest> interests = new ArrayList<>();

    private String travelStyle;

    private String pace;

    private String accommodationPreference;

    private String transportPreference;

    private String dietaryPreference;

    private String specialRequirements;
}
