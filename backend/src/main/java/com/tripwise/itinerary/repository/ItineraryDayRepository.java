package com.tripwise.itinerary.repository;

import com.tripwise.itinerary.model.ItineraryDay;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryDayRepository extends MongoRepository<ItineraryDay, String> {

    List<ItineraryDay> findByTripIdOrderByDayNumberAsc(String tripId);

    void deleteByTripId(String tripId);
}
