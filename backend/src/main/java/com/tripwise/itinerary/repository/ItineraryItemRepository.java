package com.tripwise.itinerary.repository;

import com.tripwise.itinerary.model.ItineraryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryItemRepository extends MongoRepository<ItineraryItem, String> {

    List<ItineraryItem> findByTripIdOrderByOrderIndexAsc(String tripId);

    List<ItineraryItem> findByDayIdOrderByOrderIndexAsc(String dayId);

    void deleteByTripId(String tripId);

    void deleteByDayId(String dayId);
}
