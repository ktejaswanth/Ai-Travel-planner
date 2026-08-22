package com.tripwise.itinerary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayPlanDto {
    private String id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String summary;
    private List<ActivityDto> activities;
}
