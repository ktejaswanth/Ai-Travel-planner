package com.tripwise.weather.repository;

import com.tripwise.weather.model.WeatherSnapshot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherSnapshotRepository extends MongoRepository<WeatherSnapshot, String> {

    List<WeatherSnapshot> findByTripId(String tripId);

    Optional<WeatherSnapshot> findByTripIdAndDate(String tripId, LocalDate date);

    void deleteByTripId(String tripId);
}
