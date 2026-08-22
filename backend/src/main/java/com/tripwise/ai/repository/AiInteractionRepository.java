package com.tripwise.ai.repository;

import com.tripwise.ai.model.AiInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiInteractionRepository extends MongoRepository<AiInteraction, String> {

    List<AiInteraction> findByTripIdOrderByCreatedAtDesc(String tripId);

    List<AiInteraction> findByUserIdOrderByCreatedAtDesc(String userId);

    void deleteByTripId(String tripId);
}
