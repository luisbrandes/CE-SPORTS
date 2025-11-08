package org.ce.sports.Api.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.cesports.repositories.ProjetoEsportivoRepository;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.dto.ProjetoEsportivoDTO;

@Service
public class ProjetoEsportivoService {

    @Autowired
    private ProjetoEsportivoRepository repository;

    public ProjetoEsportivo criarProjeto(ProjetoEsportivoDTO dto) {
        ProjetoEsportivo projeto = ProjetoEsportivo.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .local(dto.getLocal())
                .modalidade(dto.getModalidade())
                .responsavel(dto.getResponsavel())
                .build();

        return repository.save(projeto);
    }
}