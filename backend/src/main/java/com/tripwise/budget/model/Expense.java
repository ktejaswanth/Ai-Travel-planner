package com.tripwise.budget.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String title;

    private String category; // FLIGHT, HOTEL, TRANSPORT, FOOD, ACTIVITY, SHOPPING, OTHER

    private Double amount;

    @Builder.Default
    private String currency = "INR";

    private LocalDate date;

    private String notes;

    @CreatedDate
    private Instant createdAt;
}
