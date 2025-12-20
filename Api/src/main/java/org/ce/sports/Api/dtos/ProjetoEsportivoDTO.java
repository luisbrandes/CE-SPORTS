package org.ce.sports.Api.dtos;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetoEsportivoDTO {
    private String nome;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String local;
    private String modalidade;
    private String responsavel;
    private Integer vagasTotais;
}
