package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(RoleEnum role);
    Optional<User> findByResetToken(String resetToken);
    List<User> findByReceberNotificacoesTrue();
}