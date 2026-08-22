package com.tripwise.trip.dto;

import com.tripwise.trip.model.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {

    private String id;
    private String userId;
    private String title;
    private String origin;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
    private Double budget;
    private String currency;
    private TripStatus status;
    private TripPreferenceDto preferences;
    private Instant createdAt;
    private Instant updatedAt;
}
