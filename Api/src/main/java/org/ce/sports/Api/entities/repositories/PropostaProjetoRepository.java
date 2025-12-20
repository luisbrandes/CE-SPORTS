package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.enums.StatusProposta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropostaProjetoRepository extends JpaRepository<PropostaProjeto, Long> {

    List<PropostaProjeto> findByAlunoEmail(String email);

    List<PropostaProjeto> findByStatus(StatusProposta status);
    
    List<PropostaProjeto> findByAlunoEmailAndStatus(String email, StatusProposta status);
}
