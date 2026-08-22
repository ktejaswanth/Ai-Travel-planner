package com.tripwise.trip.repository;

import com.tripwise.trip.model.TripPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripPreferenceRepository extends MongoRepository<TripPreference, String> {

    Optional<TripPreference> findByTripId(String tripId);

    void deleteByTripId(String tripId);
}
