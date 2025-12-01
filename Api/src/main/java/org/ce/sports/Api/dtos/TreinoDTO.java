package org.ce.sports.Api.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreinoDTO {
    private String modalidade;
    private LocalDateTime dataHora;
    private String local;
    private String professor;
    private Integer vagasTotais;
}