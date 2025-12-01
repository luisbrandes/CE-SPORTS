package org.ce.sports.Api.entities.repositories;

import java.util.Optional;

import org.ce.sports.Api.entities.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipeRepository extends JpaRepository<Equipe, Long>{
    Optional<Equipe> findByNome(String nome);
}
