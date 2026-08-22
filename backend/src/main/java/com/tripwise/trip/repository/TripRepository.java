package com.tripwise.trip.repository;

import com.tripwise.trip.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends MongoRepository<Trip, String> {

    List<Trip> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Trip> findByIdAndUserId(String id, String userId);

    boolean existsByIdAndUserId(String id, String userId);
}
