package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.AvaliacaoProposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AvaliacaoPropostaRepository
        extends JpaRepository<AvaliacaoProposta, Long> {

    @Query("""
        SELECT AVG(a.nota)
        FROM AvaliacaoProposta a
        WHERE a.proposta.id = :propostaId
    """)
    Double calcularMediaPorProposta(@Param("propostaId") Long propostaId);

    Optional<AvaliacaoProposta> findByProposta_IdAndUsuario_Id(
            Long propostaId,
            Long usuarioId
    );
}

