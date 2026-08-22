package com.tripwise.place.repository;

import com.tripwise.place.model.SavedPlace;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedPlaceRepository extends MongoRepository<SavedPlace, String> {

    Optional<SavedPlace> findByPlaceId(String placeId);

    boolean existsByPlaceId(String placeId);
}
