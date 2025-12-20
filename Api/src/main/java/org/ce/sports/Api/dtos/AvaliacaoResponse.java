package org.ce.sports.Api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvaliacaoResponse {
    private Long propostaId;
    private Double mediaAvaliacoes;
}

