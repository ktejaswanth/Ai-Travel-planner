package com.tripwise.itinerary.dto;

import com.tripwise.budget.model.BudgetPlan;
import com.tripwise.integrations.pricing.dto.LivePriceContext;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryResponse {
    private String tripId;
    private List<DayPlanDto> days;
    private BudgetPlan budgetPlan;
    private LivePriceContext pricingContext;
}
