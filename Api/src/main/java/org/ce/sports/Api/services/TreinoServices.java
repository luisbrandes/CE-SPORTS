package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ce.sports.Api.entities.repositories.TreinoRepository;
import org.ce.sports.Api.entities.Treino;
import org.ce.sports.Api.dtos.TreinoDTO;

@Service
@RequiredArgsConstructor
public class TreinoServices {

    private final TreinoRepository repository;

    public Treino criarTreino(TreinoDTO dto) {

        Treino treino = Treino.builder()
                .modalidade(dto.getModalidade())
                .dataHora(dto.getDataHora())
                .local(dto.getLocal())
                .professor(dto.getProfessor())
                .vagasTotais(dto.getVagasTotais())
                  // inicia igual às vagas totais
                .build();

        return repository.save(treino);
    }
}
