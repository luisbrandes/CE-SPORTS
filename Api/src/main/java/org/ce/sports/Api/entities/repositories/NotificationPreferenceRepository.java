package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.NotificationPreference;
import org.ce.sports.Api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {

    Optional<NotificationPreference> findByUser(User user);
    Optional<NotificationPreference> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}