package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {
    // Se precisar de buscas específicas, adicionamos depois.
}
