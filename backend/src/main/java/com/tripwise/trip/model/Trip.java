package com.tripwise.trip.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String title;

    private String origin;

    @Indexed
    private String destination;

    @Indexed
    private LocalDate startDate;

    private LocalDate endDate;

    private Integer travelers;

    private Double budget;

    @Builder.Default
    private String currency = "INR";

    @Builder.Default
    private TripStatus status = TripStatus.PLANNING;

    @CreatedDate
    @Indexed
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
