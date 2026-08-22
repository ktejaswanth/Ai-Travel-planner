package com.tripwise.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_interactions")
public class AiInteraction {

    @Id
    private String id;

    @Indexed
    private String tripId;

    @Indexed
    private String userId;

    private String prompt;

    private String response;

    private Integer tokensUsed;

    private String interactionType; // ITINERARY_GEN, REPLAN, CHAT, PREFERENCE_ANALYSIS

    @CreatedDate
    private Instant createdAt;
}
