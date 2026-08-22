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
public class DistanceMatrixDto {
    private List<String> originAddresses;
    private List<String> destinationAddresses;
    private List<MatrixRowDto> rows;
    private String status;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatrixRowDto {
        private List<MatrixElementDto> elements;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatrixElementDto {
        private String status;
        private double distanceKm;
        private int durationMinutes;
        private String formattedDistance;
        private String formattedDuration;
    }
}
