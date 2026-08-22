package com.tripwise.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiReplanRequestDto {
    private String tripId;
    private int dayNumber;
    private String reason; // e.g. "WEATHER_RAIN", "USER_PREFERENCE", "TIME_CONSTRAINTS"
    private String customInstruction;
}
