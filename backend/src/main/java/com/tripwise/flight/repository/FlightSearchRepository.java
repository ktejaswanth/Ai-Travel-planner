package com.tripwise.flight.repository;

import com.tripwise.flight.model.FlightSearch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightSearchRepository extends MongoRepository<FlightSearch, String> {

    List<FlightSearch> findByTripIdOrderByCreatedAtDesc(String tripId);

    void deleteByTripId(String tripId);
}
