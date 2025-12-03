package org.ce.sports.Api.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjetoEsportivoResponse {

    private Long id;
    private String nome;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String local;
    private String modalidade;
    private String responsavel;
    private Integer vagasTotais;
    private Integer vagasPreenchidas;
}
