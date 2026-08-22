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
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "itinerary_days")
public class ItineraryDay {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private Integer dayNumber;

    private LocalDate date;

    private String title;

    private String summary;

    @CreatedDate
    private Instant createdAt;
}
