package com.tripwise.packing.repository;

import com.tripwise.packing.model.PackingList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackingListRepository extends MongoRepository<PackingList, String> {

    List<PackingList> findByTripId(String tripId);

    void deleteByTripId(String tripId);
}
