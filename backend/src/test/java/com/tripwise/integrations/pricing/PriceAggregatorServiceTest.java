package com.tripwise.integrations.pricing;

import com.tripwise.integrations.pricing.dto.LivePriceContext;
import com.tripwise.integrations.pricing.service.CityCostIndexService;
import com.tripwise.integrations.pricing.service.PriceAggregatorService;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripPreference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PriceAggregatorServiceTest {

    private PriceAggregatorService priceAggregatorService;

    @BeforeEach
    void setUp() {
        CityCostIndexService cityCostIndexService = new CityCostIndexService();
        priceAggregatorService = new PriceAggregatorService(cityCostIndexService);
    }

    @Test
    @DisplayName("Should allocate budget proportions correctly for Goa trip")
    void testAggregatePricesForGoaTrip() {
        Trip trip = Trip.builder()
                .id("trip_goa_1")
                .origin("Mumbai")
                .destination("Goa")
                .startDate(LocalDate.now().plusDays(10))
                .endDate(LocalDate.now().plusDays(13)) // 4 days, 3 nights
                .travelers(2)
                .budget(30000.0)
                .currency("INR")
                .build();

        TripPreference preference = TripPreference.builder()
                .tripId("trip_goa_1")
                .accommodationPreference("Hotel")
                .travelStyle("Balanced")
                .interests(List.of(com.tripwise.trip.model.Interest.BEACH, com.tripwise.trip.model.Interest.FOOD))
                .build();

        LivePriceContext context = priceAggregatorService.aggregatePrices(trip, preference);

        assertNotNull(context);
        assertEquals(4, context.getDurationDays());
        assertEquals(2, context.getTravelers());
        assertEquals(30000.0, context.getTotalBudget());

        assertTrue(context.getFlightEstimateTotal() > 0);
        assertTrue(context.getHotelEstimateTotal() > 0);
        assertTrue(context.getEstimatedFoodTotal() > 0);
        assertTrue(context.getEstimatedActivitiesTotal() > 0);

        // Sum of all allocations must be within the total budget
        double sum = context.getFlightEstimateTotal() +
                     context.getHotelEstimateTotal() +
                     context.getEstimatedFoodTotal() +
                     context.getEstimatedActivitiesTotal() +
                     context.getEstimatedTransportTotal() +
                     context.getEmergencyBuffer();

        assertTrue(sum <= context.getTotalBudget() + 10.0, "Total allocations should not exceed overall budget");
    }
}
