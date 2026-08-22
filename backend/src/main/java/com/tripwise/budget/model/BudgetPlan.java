package com.tripwise.budget.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "budget_plans")
public class BudgetPlan {

    @Id
    private String id;

    @Indexed(unique = true)
    private String tripId;

    private Double totalBudget;

    @Builder.Default
    private String currency = "INR";

    private Double flightAllocation;

    private Double hotelAllocation;

    private Double transportAllocation;

    private Double foodAllocation;

    private Double activitiesAllocation;

    private Double shoppingAllocation;

    private Double emergencyBuffer;

    private Double totalEstimated;

    private Double remaining;

    private Double utilizationPercentage;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
