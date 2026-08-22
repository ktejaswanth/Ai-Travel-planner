package com.tripwise.hotel.model;

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
@Document(collection = "hotel_searches")
public class HotelSearch {

    @Id
    private String id;

    @Indexed
    private String tripId;

    private String cityCode;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Object offersData;

    @CreatedDate
    private Instant createdAt;
}
