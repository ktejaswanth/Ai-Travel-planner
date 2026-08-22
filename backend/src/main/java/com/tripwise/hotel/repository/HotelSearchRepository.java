package com.tripwise.hotel.repository;

import com.tripwise.hotel.model.HotelSearch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelSearchRepository extends MongoRepository<HotelSearch, String> {

    List<HotelSearch> findByTripIdOrderByCreatedAtDesc(String tripId);

    void deleteByTripId(String tripId);
}
