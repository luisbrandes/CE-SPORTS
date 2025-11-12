package org.ce.sports.Api.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.ce.sports.Api.entities.repositories.ProjetoEsportivoRepository;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.dtos.ProjetoEsportivoDTO;

import java.util.List;

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

    public List<ProjetoEsportivo> listarProjetos() {
        return repository.findAll();
    }
}