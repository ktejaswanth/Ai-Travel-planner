package com.tripwise.itinerary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDto {
    private String id;
    private String title;
    private String description;
    private String locationName;
    private String startTime;
    private String endTime;
    private Integer durationMinutes;
    private Double estimatedCost;
    private String currency;
    private String category; // ATTRACTION, RESTAURANT, HOTEL, TRANSPORT, ACTIVITY
    private Integer orderIndex;
}
