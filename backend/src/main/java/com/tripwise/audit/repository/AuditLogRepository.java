package com.tripwise.audit.model;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);

    List<AuditLog> findByActionOrderByTimestampDesc(String action);
}
