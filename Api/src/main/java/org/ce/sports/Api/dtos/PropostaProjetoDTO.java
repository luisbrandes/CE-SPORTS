package org.ce.sports.Api.dtos;


import lombok.Data;
import java.time.LocalDate;

@Data
public class PropostaProjetoDTO {

    private String nome;
    private String descricao;
    private String modalidade;
    private String local;

    private LocalDate dataInicio;
    private LocalDate dataFim;
}