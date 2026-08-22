package com.tripwise.integrations.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivePriceContext {
    private String origin;
    private String destination;
    private String currency;
    private int durationDays;
    private int travelers;
    private double totalBudget;

    // Scraped / Aggregated Allocations
    private double flightEstimateTotal;
    private double hotelEstimateTotal;
    private double hotelPerNight;
    private double estimatedFoodTotal;
    private double estimatedActivitiesTotal;
    private double estimatedTransportTotal;
    private double emergencyBuffer;

    // Remaining discretionary budget for daily activities & meals
    private double remainingForActivitiesAndFood;
    private double dailyBudgetCap;

    // Local benchmark unit costs
    private CityCostProfile costProfile;
    private Map<String, Double> activityFeeCatalog;
}
