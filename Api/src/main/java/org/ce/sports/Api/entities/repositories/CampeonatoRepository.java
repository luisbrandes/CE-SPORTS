package org.ce.sports.Api.entities.repositories;

import java.util.Optional;

import org.ce.sports.Api.entities.Campeonato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CampeonatoRepository extends JpaRepository<Campeonato, Long> {
    boolean existsByNome(String nome);

    Optional<Campeonato> findByNome(String nome);

    @Query("SELECT c FROM Campeonato c LEFT JOIN FETCH c.equipes WHERE c.nome = :nome")
    Optional<Campeonato> findByNomeComEquipes(String nome);
}
