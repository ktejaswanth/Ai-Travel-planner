package com.tripwise.weather.model;

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
@Document(collection = "weather_snapshots")
public class WeatherSnapshot {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String destination;

    private LocalDate date;

    private Double temperature;

    private String condition;

    private Integer rainProbability;

    @Builder.Default
    private Boolean outdoorSuitable = true;

    @CreatedDate
    private Instant createdAt;
}
