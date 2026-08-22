package com.tripwise.itinerary.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "itinerary_items")
public class ItineraryItem {

    @Id
    private String id;

    @Indexed
    private String tripId;

    @Indexed
    private String dayId;

    private String placeId;

    private String title;

    private String description;

    private String locationName;

    private Double latitude;

    private Double longitude;

    private String startTime;

    private String endTime;

    private Integer durationMinutes;

    private Double estimatedCost;

    private String currency;

    private String category; // ATTRACTION, RESTAURANT, HOTEL, TRANSPORT, ACTIVITY

    @Builder.Default
    private Boolean weatherSuitable = true;

    @Builder.Default
    private String status = "PLANNED"; // PLANNED, VISITED, SKIPPED, REPLANNED

    private Integer orderIndex;

    @CreatedDate
    private Instant createdAt;
}
