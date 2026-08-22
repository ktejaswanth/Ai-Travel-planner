package com.tripwise.itinerary.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.budget.model.BudgetPlan;
import com.tripwise.budget.repository.BudgetPlanRepository;
import com.tripwise.common.exception.ResourceNotFoundException;
import com.tripwise.integrations.gemini.GeminiAdapter;
import com.tripwise.integrations.pricing.dto.LivePriceContext;
import com.tripwise.integrations.pricing.service.PriceAggregatorService;
import com.tripwise.itinerary.dto.ActivityDto;
import com.tripwise.itinerary.dto.DayPlanDto;
import com.tripwise.itinerary.dto.ItineraryResponse;
import com.tripwise.itinerary.model.ItineraryDay;
import com.tripwise.itinerary.model.ItineraryItem;
import com.tripwise.itinerary.repository.ItineraryDayRepository;
import com.tripwise.itinerary.repository.ItineraryItemRepository;
import com.tripwise.trip.model.Trip;
import com.tripwise.trip.model.TripPreference;
import com.tripwise.trip.model.TripStatus;
import com.tripwise.trip.repository.TripPreferenceRepository;
import com.tripwise.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final TripRepository tripRepository;
    private final TripPreferenceRepository tripPreferenceRepository;
    private final ItineraryDayRepository dayRepository;
    private final ItineraryItemRepository itemRepository;
    private final BudgetPlanRepository budgetPlanRepository;
    private final PriceAggregatorService priceAggregatorService;
    private final GeminiAdapter geminiAdapter;
    private final ObjectMapper objectMapper;

    public ItineraryResponse generateItinerary(String tripId, String userId) {
        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or unauthorized"));

        TripPreference preference = tripPreferenceRepository.findByTripId(tripId).orElse(null);

        // 1. Scrape & Aggregate Live Prices
        LivePriceContext priceContext = priceAggregatorService.aggregatePrices(trip, preference);

        // 2. Build Prompt & Query Gemini
        String prompt = geminiAdapter.buildSecureGroundedPrompt(trip, preference, priceContext);
        String aiRawJson = geminiAdapter.generateAIResponse(prompt);

        // 3. Parse or Generate Itinerary Days & Activities
        List<DayPlanDto> dayPlans = parseOrGenerateDays(aiRawJson, trip, preference, priceContext);

        // 4. Persist Itinerary in MongoDB
        persistItinerary(trip.getId(), dayPlans, priceContext.getCurrency());

        // 5. Build & Persist Budget Plan
        BudgetPlan budgetPlan = saveBudgetPlan(trip, priceContext);

        // 6. Update Trip Status to READY
        trip.setStatus(TripStatus.READY);
        tripRepository.save(trip);

        return ItineraryResponse.builder()
                .tripId(trip.getId())
                .days(dayPlans)
                .budgetPlan(budgetPlan)
                .pricingContext(priceContext)
                .build();
    }

    public ItineraryResponse getItinerary(String tripId, String userId) {
        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found or unauthorized"));

        List<ItineraryDay> days = dayRepository.findByTripIdOrderByDayNumberAsc(tripId);
        List<DayPlanDto> dayPlans = new ArrayList<>();

        for (ItineraryDay day : days) {
            List<ItineraryItem> items = itemRepository.findByDayIdOrderByOrderIndexAsc(day.getId());
            List<ActivityDto> actDtos = items.stream().map(this::mapItemToDto).toList();

            dayPlans.add(DayPlanDto.builder()
                    .id(day.getId())
                    .dayNumber(day.getDayNumber())
                    .date(day.getDate())
                    .title(day.getTitle())
                    .summary(day.getSummary())
                    .activities(actDtos)
                    .build());
        }

        BudgetPlan budgetPlan = budgetPlanRepository.findByTripId(tripId).orElse(null);
        TripPreference preference = tripPreferenceRepository.findByTripId(tripId).orElse(null);
        LivePriceContext priceContext = priceAggregatorService.aggregatePrices(trip, preference);

        return ItineraryResponse.builder()
                .tripId(tripId)
                .days(dayPlans)
                .budgetPlan(budgetPlan)
                .pricingContext(priceContext)
                .build();
    }

    private List<DayPlanDto> parseOrGenerateDays(String aiRawJson, Trip trip, TripPreference pref, LivePriceContext priceCtx) {
        if (aiRawJson != null && !aiRawJson.isBlank()) {
            try {
                // Strip markdown code block wrappers if any
                String cleaned = aiRawJson.trim();
                if (cleaned.startsWith("```json")) {
                    cleaned = cleaned.substring(7);
                } else if (cleaned.startsWith("```")) {
                    cleaned = cleaned.substring(3);
                }
                if (cleaned.endsWith("```")) {
                    cleaned = cleaned.substring(0, cleaned.length() - 3);
                }

                JsonNode root = objectMapper.readTree(cleaned.trim());
                if (root.has("days") && root.get("days").isArray()) {
                    List<DayPlanDto> parsed = new ArrayList<>();
                    for (JsonNode dayNode : root.get("days")) {
                        int dayNum = dayNode.path("dayNumber").asInt(1);
                        LocalDate dayDate = trip.getStartDate().plusDays(dayNum - 1);
                        String title = dayNode.path("title").asText("Day " + dayNum);
                        String summary = dayNode.path("summary").asText("");

                        List<ActivityDto> acts = new ArrayList<>();
                        if (dayNode.has("activities") && dayNode.get("activities").isArray()) {
                            int idx = 0;
                            for (JsonNode actNode : dayNode.get("activities")) {
                                acts.add(ActivityDto.builder()
                                        .title(actNode.path("title").asText("Sightseeing Activity"))
                                        .description(actNode.path("description").asText(""))
                                        .locationName(actNode.path("locationName").asText(trip.getDestination()))
                                        .startTime(actNode.path("startTime").asText("10:00 AM"))
                                        .endTime(actNode.path("endTime").asText("12:00 PM"))
                                        .durationMinutes(actNode.path("durationMinutes").asInt(120))
                                        .estimatedCost(actNode.path("estimatedCost").asDouble(200.0))
                                        .currency(priceCtx.getCurrency())
                                        .category(actNode.path("category").asText("ATTRACTION"))
                                        .orderIndex(idx++)
                                        .build());
                            }
                        }

                        parsed.add(DayPlanDto.builder()
                                .dayNumber(dayNum)
                                .date(dayDate)
                                .title(title)
                                .summary(summary)
                                .activities(acts)
                                .build());
                    }
                    return parsed;
                }
            } catch (Exception e) {
                log.warn("Failed to parse Gemini JSON response, falling back to algorithmic itinerary: {}", e.getMessage());
            }
        }

        // High-quality deterministic fallback tailored to destination & scraped prices
        return generateGroundedFallbackDays(trip, pref, priceCtx);
    }

    private List<DayPlanDto> generateGroundedFallbackDays(Trip trip, TripPreference pref, LivePriceContext priceCtx) {
        List<DayPlanDto> days = new ArrayList<>();
        int totalDays = priceCtx.getDurationDays();
        double dailyBudget = priceCtx.getDailyBudgetCap();
        Map<String, Double> activityFees = priceCtx.getActivityFeeCatalog();
        List<String> feeKeys = new ArrayList<>(activityFees != null ? activityFees.keySet() : List.of());

        for (int i = 1; i <= totalDays; i++) {
            LocalDate date = trip.getStartDate().plusDays(i - 1);
            String dayTitle = (i == 1) ? "Arrival & City Highlights" : (i == totalDays) ? "Farewell & Souvenirs" : "Local Adventure & Culture";

            List<ActivityDto> acts = new ArrayList<>();
            double mealCost = priceCtx.getCostProfile() != null ? priceCtx.getCostProfile().getBudgetMealAvg() : 250.0;
            double activityCost = (!feeKeys.isEmpty()) ? activityFees.get(feeKeys.get((i - 1) % feeKeys.size())) : (dailyBudget * 0.35);
            String activityName = (!feeKeys.isEmpty()) ? feeKeys.get((i - 1) % feeKeys.size()) : "City Walking Tour & Landmarks";

            acts.add(ActivityDto.builder()
                    .title("Morning Discovery: " + activityName)
                    .description("Explore top scenic attractions and key landmarks in " + trip.getDestination())
                    .locationName(trip.getDestination())
                    .startTime("09:30 AM")
                    .endTime("12:30 PM")
                    .durationMinutes(180)
                    .estimatedCost(activityCost)
                    .currency(priceCtx.getCurrency())
                    .category("ATTRACTION")
                    .orderIndex(0)
                    .build());

            acts.add(ActivityDto.builder()
                    .title("Authentic Regional Lunch")
                    .description("Taste renowned local culinary specialties at a popular neighborhood bistro")
                    .locationName("Central " + trip.getDestination())
                    .startTime("01:00 PM")
                    .endTime("02:30 PM")
                    .durationMinutes(90)
                    .estimatedCost(mealCost * priceCtx.getTravelers())
                    .currency(priceCtx.getCurrency())
                    .category("RESTAURANT")
                    .orderIndex(1)
                    .build());

            acts.add(ActivityDto.builder()
                    .title("Afternoon Scenic Stroll & Sunset View")
                    .description("Relax at top-rated viewpoints, vibrant markets, and waterfront promenades")
                    .locationName(trip.getDestination())
                    .startTime("04:30 PM")
                    .endTime("07:00 PM")
                    .durationMinutes(150)
                    .estimatedCost(mealCost * 0.5)
                    .currency(priceCtx.getCurrency())
                    .category("ACTIVITY")
                    .orderIndex(2)
                    .build());

            days.add(DayPlanDto.builder()
                    .dayNumber(i)
                    .date(date)
                    .title(dayTitle)
                    .summary("Full-day exploration of " + trip.getDestination() + " designed for a " + (pref != null ? pref.getPace() : "balanced") + " pace.")
                    .activities(acts)
                    .build());
        }

        return days;
    }

    private void persistItinerary(String tripId, List<DayPlanDto> dayPlans, String currency) {
        dayRepository.deleteByTripId(tripId);
        itemRepository.deleteByTripId(tripId);

        for (DayPlanDto dayDto : dayPlans) {
            ItineraryDay savedDay = dayRepository.save(ItineraryDay.builder()
                    .tripId(tripId)
                    .dayNumber(dayDto.getDayNumber())
                    .date(dayDto.getDate())
                    .title(dayDto.getTitle())
                    .summary(dayDto.getSummary())
                    .build());

            dayDto.setId(savedDay.getId());

            if (dayDto.getActivities() != null) {
                for (ActivityDto actDto : dayDto.getActivities()) {
                    ItineraryItem savedItem = itemRepository.save(ItineraryItem.builder()
                            .tripId(tripId)
                            .dayId(savedDay.getId())
                            .title(actDto.getTitle())
                            .description(actDto.getDescription())
                            .locationName(actDto.getLocationName())
                            .startTime(actDto.getStartTime())
                            .endTime(actDto.getEndTime())
                            .durationMinutes(actDto.getDurationMinutes())
                            .estimatedCost(actDto.getEstimatedCost())
                            .currency(currency)
                            .category(actDto.getCategory())
                            .orderIndex(actDto.getOrderIndex())
                            .status("PLANNED")
                            .weatherSuitable(true)
                            .build());

                    actDto.setId(savedItem.getId());
                }
            }
        }
    }

    private BudgetPlan saveBudgetPlan(Trip trip, LivePriceContext priceCtx) {
        budgetPlanRepository.deleteByTripId(trip.getId());

        double totalEstimated = priceCtx.getFlightEstimateTotal() +
                                priceCtx.getHotelEstimateTotal() +
                                priceCtx.getEstimatedFoodTotal() +
                                priceCtx.getEstimatedActivitiesTotal() +
                                priceCtx.getEstimatedTransportTotal() +
                                priceCtx.getEmergencyBuffer();

        double remaining = Math.max(0.0, priceCtx.getTotalBudget() - totalEstimated);
        double utilization = (totalEstimated / Math.max(1.0, priceCtx.getTotalBudget())) * 100.0;

        BudgetPlan plan = BudgetPlan.builder()
                .tripId(trip.getId())
                .totalBudget(priceCtx.getTotalBudget())
                .currency(priceCtx.getCurrency())
                .flightAllocation(priceCtx.getFlightEstimateTotal())
                .hotelAllocation(priceCtx.getHotelEstimateTotal())
                .foodAllocation(priceCtx.getEstimatedFoodTotal())
                .activitiesAllocation(priceCtx.getEstimatedActivitiesTotal())
                .transportAllocation(priceCtx.getEstimatedTransportTotal())
                .emergencyBuffer(priceCtx.getEmergencyBuffer())
                .totalEstimated(totalEstimated)
                .remaining(remaining)
                .utilizationPercentage(Math.min(100.0, Math.round(utilization * 10.0) / 10.0))
                .build();

        return budgetPlanRepository.save(plan);
    }

    private ActivityDto mapItemToDto(ItineraryItem item) {
        return ActivityDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .locationName(item.getLocationName())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .durationMinutes(item.getDurationMinutes())
                .estimatedCost(item.getEstimatedCost())
                .currency(item.getCurrency())
                .category(item.getCategory())
                .orderIndex(item.getOrderIndex())
                .build();
    }
}
