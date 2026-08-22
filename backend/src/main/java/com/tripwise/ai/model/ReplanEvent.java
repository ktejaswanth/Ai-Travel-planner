package com.tripwise.ai.model;

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
@Document(collection = "replan_events")
public class ReplanEvent {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String reason; // WEATHER_CHANGE, USER_REQUEST, BUDGET_OVERRUN

    private LocalDate affectedDate;

    private String changesSummary;

    private Object beforeSnapshot;

    private Object afterSnapshot;

    @Builder.Default
    private Boolean confirmed = false;

    @CreatedDate
    private Instant createdAt;
}
