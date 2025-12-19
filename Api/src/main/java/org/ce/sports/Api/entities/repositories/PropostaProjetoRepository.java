package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.PropostaProjeto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropostaProjetoRepository extends JpaRepository<PropostaProjeto, Long> {
    List<PropostaProjeto> findByAlunoEmail(String email);
}