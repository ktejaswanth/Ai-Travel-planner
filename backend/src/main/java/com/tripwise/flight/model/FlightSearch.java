package com.tripwise.flight.model;

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
@Document(collection = "flight_searches")
public class FlightSearch {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String origin;

    private String destination;

    private LocalDate departureDate;

    private LocalDate returnDate;

    private Object offersData;

    @CreatedDate
    private Instant createdAt;
}
