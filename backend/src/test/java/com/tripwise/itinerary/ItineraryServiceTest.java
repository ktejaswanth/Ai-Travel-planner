package com.tripwise.itinerary;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.budget.model.BudgetPlan;
import com.tripwise.budget.repository.BudgetPlanRepository;
import com.tripwise.integrations.gemini.GeminiAdapter;
import com.tripwise.integrations.pricing.dto.LivePriceContext;
import com.tripwise.integrations.pricing.service.PriceAggregatorService;
import com.tripwise.itinerary.dto.ItineraryResponse;
import com.tripwise.itinerary.model.ItineraryDay;
import com.tripwise.itinerary.model.ItineraryItem;
import com.tripwise.itinerary.repository.ItineraryDayRepository;
import com.tripwise.itinerary.repository.ItineraryItemRepository;
import com.tripwise.itinerary.service.ItineraryService;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripPreference;
import com.tripwise.trip.model.TripStatus;
import com.tripwise.trip.repository.TripPreferenceRepository;
import com.tripwise.trip.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItineraryServiceTest {

    @Mock
    private TripRepository tripRepository;
    @Mock
    private TripPreferenceRepository tripPreferenceRepository;
    @Mock
    private ItineraryDayRepository dayRepository;
    @Mock
    private ItineraryItemRepository itemRepository;
    @Mock
    private BudgetPlanRepository budgetPlanRepository;
    @Mock
    private PriceAggregatorService priceAggregatorService;
    @Mock
    private GeminiAdapter geminiAdapter;
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ItineraryService itineraryService;

    private Trip testTrip;
    private TripPreference testPref;
    private LivePriceContext testPriceCtx;

    @BeforeEach
    void setUp() {
        testTrip = Trip.builder()
                .id("trip_123")
                .userId("user_456")
                .destination("Goa")
                .origin("Mumbai")
                .startDate(LocalDate.now().plusDays(5))
                .endDate(LocalDate.now().plusDays(8))
                .travelers(2)
                .budget(25000.0)
                .currency("INR")
                .status(TripStatus.PLANNING)
                .build();

        testPref = TripPreference.builder()
                .tripId("trip_123")
                .accommodationPreference("Hotel")
                .pace("Moderate")
                .interests(List.of(com.tripwise.trip.model.Interest.BEACH, com.tripwise.trip.model.Interest.FOOD))
                .build();

        testPriceCtx = LivePriceContext.builder()
                .destination("Goa")
                .currency("INR")
                .durationDays(4)
                .travelers(2)
                .totalBudget(25000.0)
                .flightEstimateTotal(6000.0)
                .hotelEstimateTotal(7500.0)
                .hotelPerNight(2500.0)
                .estimatedFoodTotal(5000.0)
                .estimatedActivitiesTotal(4000.0)
                .estimatedTransportTotal(1500.0)
                .emergencyBuffer(1000.0)
                .remainingForActivitiesAndFood(9000.0)
                .dailyBudgetCap(2250.0)
                .build();
    }

    @Test
    @DisplayName("Should generate, persist and return price-grounded itinerary")
    void testGenerateItinerary() {
        when(tripRepository.findByIdAndUserId("trip_123", "user_456")).thenReturn(Optional.of(testTrip));
        when(tripPreferenceRepository.findByTripId("trip_123")).thenReturn(Optional.of(testPref));
        when(priceAggregatorService.aggregatePrices(any(), any())).thenReturn(testPriceCtx);
        when(geminiAdapter.buildSecureGroundedPrompt(any(), any(), any())).thenReturn("mock-prompt");
        when(geminiAdapter.generateAIResponse(any())).thenReturn(null); // Triggers smart deterministic fallback

        when(dayRepository.save(any())).thenAnswer(invocation -> {
            ItineraryDay day = invocation.getArgument(0);
            day.setId("day_" + day.getDayNumber());
            return day;
        });

        when(itemRepository.save(any())).thenAnswer(invocation -> {
            ItineraryItem item = invocation.getArgument(0);
            item.setId("item_" + System.currentTimeMillis());
            return item;
        });

        when(budgetPlanRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ItineraryResponse response = itineraryService.generateItinerary("trip_123", "user_456");

        assertNotNull(response);
        assertEquals("trip_123", response.getTripId());
        assertEquals(4, response.getDays().size());
        assertNotNull(response.getBudgetPlan());
        assertEquals(25000.0, response.getBudgetPlan().getTotalBudget());

        verify(tripRepository).save(testTrip);
        assertEquals(TripStatus.READY, testTrip.getStatus());
    }
}
