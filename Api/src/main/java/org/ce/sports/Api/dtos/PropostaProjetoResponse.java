package org.ce.sports.Api.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PropostaProjetoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private String modalidade;
    private String local;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private String status;
    private String alunoNome;
}
