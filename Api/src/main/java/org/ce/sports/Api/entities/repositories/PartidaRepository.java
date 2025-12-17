package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {

    @Query("SELECT p FROM Partida p JOIN FETCH p.campeonato JOIN FETCH p.equipe1 JOIN FETCH p.equipe2 WHERE p.campeonato.id = :campeonatoId")
    List<Partida> findByCampeonatoId(@Param("campeonatoId") Long campeonatoId);

    @Query("SELECT p FROM Partida p JOIN FETCH p.campeonato JOIN FETCH p.equipe1 JOIN FETCH p.equipe2 WHERE p.campeonato.nome = :nomeCampeonato")
    List<Partida> findByCampeonatoNome(@Param("nomeCampeonato") String nomeCampeonato);

    @Query("SELECT p FROM Partida p JOIN FETCH p.campeonato JOIN FETCH p.equipe1 JOIN FETCH p.equipe2 ORDER BY p.data DESC")
    List<Partida> findAllWithDetails();

    @Query("SELECT p FROM Partida p WHERE p.equipe1.id = :equipeId")
    List<Partida> findByEquipe1Id(@Param("equipeId") Long equipeId);

    @Query("SELECT p FROM Partida p WHERE p.equipe2.id = :equipeId")
    List<Partida> findByEquipe2Id(@Param("equipeId") Long equipeId);

    @Query("SELECT p FROM Partida p WHERE p.equipe1.id = :equipeId OR p.equipe2.id = :equipeId")
    List<Partida> findByEquipeParticipanteId(@Param("equipeId") Long equipeId);

    @Query("SELECT p FROM Partida p WHERE p.vencedor.id = :equipeId")
    List<Partida> findByEquipeVencedoraId(@Param("equipeId") Long equipeId);
}