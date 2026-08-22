package com.tripwise.packing.model;

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
@Document(collection = "packing_lists")
public class PackingList {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String category; // CLOTHING, TOILETRIES, ELECTRONICS, DOCUMENTS, MEDICINE, ACCESSORIES

    private String itemName;

    @Builder.Default
    private Integer quantity = 1;

    @Builder.Default
    private Boolean packed = false;

    @Builder.Default
    private Boolean aiSuggested = true;

    @CreatedDate
    private Instant createdAt;
}
