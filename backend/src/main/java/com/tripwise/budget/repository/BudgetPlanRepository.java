package com.tripwise.budget.repository;

import com.tripwise.budget.model.BudgetPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetPlanRepository extends MongoRepository<BudgetPlan, String> {

    Optional<BudgetPlan> findByTripId(String tripId);

    void deleteByTripId(String tripId);
}
