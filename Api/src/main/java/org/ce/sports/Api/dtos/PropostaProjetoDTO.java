package org.ce.sports.Api.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PropostaProjetoDTO {

    private String nome;
    private String descricao;
    private String modalidade;
    private String local;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataInicio;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataFim;

    private Integer vagasTotais;
}
