package org.ce.sports.Api.dtos;

import org.ce.sports.Api.enums.ModalidadeEnum;
import java.util.List;

public record EquipeDetalhesResponse(
        Long id,
        String nome,
        ModalidadeEnum modalidade,
        String descricao,
        boolean ativo,
        List<IntegranteDTO> integrantes,
        List<CampeonatoEquipeDTO> campeonatos) {
}