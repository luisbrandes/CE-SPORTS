package org.ce.sports.Api.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjetoUpdateDTO {
    private String nome;
    private String descricao;
    private String modalidade;
    private String local;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String responsavel;
    private Integer vagasTotais;
}
