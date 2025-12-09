package org.ce.sports.Api.dtos;

import org.ce.sports.Api.enums.ModalidadeEnum;
import java.util.Set;

public record EquipeRequest(
        String nome,
        Set<Long> integrantesIds,
        ModalidadeEnum modalidade,
        String descricao) {
}