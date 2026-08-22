package com.tripwise.place.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "saved_places")
public class SavedPlace {

    @Id
    private String id;

    @Indexed(unique = true)
    private String placeId;

    private String name;

    private String formattedAddress;

    private Double latitude;

    private Double longitude;

    private Double rating;

    private Integer userRatingsTotal;

    private List<String> types;

    private String photoUrl;

    @CreatedDate
    private Instant createdAt;
}
