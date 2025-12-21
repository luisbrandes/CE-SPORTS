package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.enums.ModalidadeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {

    Optional<Equipe> findByNome(String nome);

    List<Equipe> findByModalidade(ModalidadeEnum modalidade);

    List<Equipe> findByAtivoTrue();

    List<Equipe> findByAtivoFalse();

    @Query("SELECT e FROM Equipe e WHERE LOWER(e.nome) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Equipe> buscarPorNomeContendo(@Param("termo") String termo);

    @Query("SELECT e FROM Equipe e JOIN e.campeonatos c WHERE c.id = :campeonatoId")
    List<Equipe> findByCampeonatoId(@Param("campeonatoId") Long campeonatoId);

    @Query("SELECT e FROM Equipe e JOIN e.integrantes i WHERE i.id = :alunoId")
    List<Equipe> findByIntegranteId(@Param("alunoId") Long alunoId);
}