package org.ce.sports.Api.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PropostaResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String modalidade;
    private String local;

    private String alunoNome;

    private Integer vagasTotais;

    private Double mediaAvaliacoes;
    private Integer minhaNota;
}
