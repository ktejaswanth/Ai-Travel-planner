package com.tripwise.trip.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTripRequest {

    private String title;

    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Travelers count is required")
    @Min(value = 1, message = "Travelers count must be at least 1")
    private Integer travelers;

    @NotNull(message = "Budget is required")
    @PositiveOrZero(message = "Budget must be greater than or equal to 0")
    private Double budget;

    @Builder.Default
    private String currency = "INR";

    private TripPreferenceDto preferences;
}
