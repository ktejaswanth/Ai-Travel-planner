package com.tripwise.integrations.google.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDto {
    private String origin;
    private String destination;
    private String travelMode;
    private double distanceKm;
    private int durationMinutes;
    private String formattedDistance;
    private String formattedDuration;
    private String polyline;
    private List<RouteStepDto> steps;
    private String summary;
    private String status;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteStepDto {
        private String instruction;
        private double distanceKm;
        private int durationMinutes;
        private String startLocation;
        private String endLocation;
    }
}
