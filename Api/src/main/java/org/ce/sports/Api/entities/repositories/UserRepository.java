package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
=======

>>>>>>> 4b7c5599545fa01fdc2f9b9f0f459d1381ab978a
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
<<<<<<< HEAD

    List<User> findByRole(RoleEnum role);
=======
    Optional<User> findByResetToken(String resetToken);
    List<User> findByReceberNotificacoesTrue();
>>>>>>> 4b7c5599545fa01fdc2f9b9f0f459d1381ab978a
}