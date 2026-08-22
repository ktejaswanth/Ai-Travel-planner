package com.tripwise.user.repository;

import com.tripwise.user.model.UserProfilePreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfilePreferenceRepository extends MongoRepository<UserProfilePreference, String> {

    Optional<UserProfilePreference> findByUserId(String userId);

    void deleteByUserId(String userId);
}
