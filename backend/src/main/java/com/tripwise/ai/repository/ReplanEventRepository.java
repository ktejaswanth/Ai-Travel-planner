package com.tripwise.ai.repository;

import com.tripwise.ai.model.ReplanEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplanEventRepository extends MongoRepository<ReplanEvent, String> {

    List<ReplanEvent> findByTripIdOrderByCreatedAtDesc(String tripId);

    void deleteByTripId(String tripId);
}
