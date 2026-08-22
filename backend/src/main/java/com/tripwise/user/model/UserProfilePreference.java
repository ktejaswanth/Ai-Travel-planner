package com.tripwise.user.model;

import com.tripwise.trip.model.Interest;
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
@Document(collection = "user_profile_preferences")
public class UserProfilePreference {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    @Builder.Default
    private List<Interest> interests = new ArrayList<>();

    private String travelStyle; // BUDGET, LUXURY, FAMILY, SOLO, BALANCED

    private String pace; // RELAXED, MODERATE, FAST_PACED

    private String foodPreference; // VEGETARIAN, VEGAN, HALAL, GLUTEN_FREE, NONE

    private String accommodationPreference; // HOTEL, RESORT, HOSTEL, APARTMENT

    private String transportPreference; // FLIGHT, PUBLIC_TRANSIT, RENTAL_CAR, DRIVING
}
