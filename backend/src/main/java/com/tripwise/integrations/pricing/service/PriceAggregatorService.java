package com.tripwise.integrations.pricing.service;

import com.tripwise.integrations.pricing.dto.CityCostProfile;
import com.tripwise.integrations.pricing.dto.LivePriceContext;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripPreference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceAggregatorService {

    private final CityCostIndexService cityCostIndexService;

    public LivePriceContext aggregatePrices(Trip trip, TripPreference preference) {
        long durationDays = Math.max(1, ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1);
        int travelers = Math.max(1, trip.getTravelers() != null ? trip.getTravelers() : 1);
        double totalBudget = trip.getBudget() != null ? trip.getBudget() : 20000.0;
        String currency = trip.getCurrency() != null ? trip.getCurrency() : "INR";

        CityCostProfile profile = cityCostIndexService.getCostProfile(trip.getDestination(), currency);

        // 1. Hotel Rate Calculation based on preference
        String accomPref = preference != null && preference.getAccommodationPreference() != null 
                ? preference.getAccommodationPreference().toLowerCase() 
                : "hotel";

        double hotelPerNight;
        if (accomPref.contains("hostel") || accomPref.contains("budget")) {
            hotelPerNight = profile.getMedianHostelRate();
        } else if (accomPref.contains("resort") || accomPref.contains("luxury")) {
            hotelPerNight = profile.getMedianLuxuryResort();
        } else {
            hotelPerNight = profile.getMedianHotel3StarRate();
        }

        // Total room nights (assuming 2 travelers per room)
        int roomsNeeded = (int) Math.ceil((double) travelers / 2);
        long nights = Math.max(1, durationDays - 1);
        double hotelEstimateTotal = hotelPerNight * roomsNeeded * nights;

        // 2. Flight / Transit Estimation
        double flightEstimatePerPerson = estimateFlightCost(trip.getOrigin(), trip.getDestination(), currency);
        double flightEstimateTotal = flightEstimatePerPerson * travelers;

        // Cap flights & hotels so they do not completely swallow the user's budget
        double fixedCost = flightEstimateTotal + hotelEstimateTotal;
        if (fixedCost > totalBudget * 0.70) {
            // Scale dynamically if budget is constrained
            double scaleFactor = (totalBudget * 0.60) / Math.max(1.0, fixedCost);
            flightEstimateTotal = Math.round(flightEstimateTotal * scaleFactor);
            hotelEstimateTotal = Math.round(hotelEstimateTotal * scaleFactor);
            hotelPerNight = Math.round(hotelEstimateTotal / (roomsNeeded * nights));
        }

        // 3. Compute Discretionary Pool for Food, Activities, and Transit
        double remainingForDaily = Math.max(100.0, totalBudget - (flightEstimateTotal + hotelEstimateTotal));
        double emergencyBuffer = Math.round(remainingForDaily * 0.08); // 8% buffer
        double usableDailyPool = remainingForDaily - emergencyBuffer;

        double foodAllocation = Math.round(usableDailyPool * 0.45);
        double activitiesAllocation = Math.round(usableDailyPool * 0.40);
        double transportAllocation = Math.round(usableDailyPool * 0.15);

        double dailyBudgetCap = Math.round(usableDailyPool / durationDays);

        return LivePriceContext.builder()
                .origin(trip.getOrigin())
                .destination(trip.getDestination())
                .currency(currency)
                .durationDays((int) durationDays)
                .travelers(travelers)
                .totalBudget(totalBudget)
                .flightEstimateTotal(flightEstimateTotal)
                .hotelEstimateTotal(hotelEstimateTotal)
                .hotelPerNight(hotelPerNight)
                .estimatedFoodTotal(foodAllocation)
                .estimatedActivitiesTotal(activitiesAllocation)
                .estimatedTransportTotal(transportAllocation)
                .emergencyBuffer(emergencyBuffer)
                .remainingForActivitiesAndFood(foodAllocation + activitiesAllocation)
                .dailyBudgetCap(dailyBudgetCap)
                .costProfile(profile)
                .activityFeeCatalog(profile.getPopularActivityPrices())
                .build();
    }

    private double estimateFlightCost(String origin, String destination, String currency) {
        boolean isINR = "INR".equalsIgnoreCase(currency);
        if (origin == null || origin.isBlank()) {
            return isINR ? 3500.0 : 80.0;
        }

        String orig = origin.trim().toLowerCase();
        String dest = destination.trim().toLowerCase();

        // If same city / very close
        if (orig.equals(dest)) {
            return 0.0;
        }

        // Standard domestic / regional roundtrip baseline
        return isINR ? 4500.0 : 120.0;
    }
}
