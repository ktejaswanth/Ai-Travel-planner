package com.tripwise.budget.repository;

import com.tripwise.budget.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {

    List<Expense> findByTripIdOrderByDateDesc(String tripId);

    void deleteByTripId(String tripId);
}
