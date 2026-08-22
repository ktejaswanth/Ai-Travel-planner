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
public class CityCostProfile {
    private String cityName;
    private String country;
    private String currency;
    private double budgetMealAvg;       // Inexpensive restaurant meal
    private double midRangeMealAvg;     // 3-course meal for 2 (per person portion)
    private double coffeeAvg;
    private double localTransportDay;   // Public transit or scooter rental per day
    private double taxiPerKm;
    private double medianHostelRate;    // per night
    private double medianHotel3StarRate;// per night
    private double medianLuxuryResort;  // per night
    private Map<String, Double> popularActivityPrices; // Activity name -> typical ticket/fee in currency
}
