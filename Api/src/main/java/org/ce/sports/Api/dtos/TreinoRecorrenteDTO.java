package org.ce.sports.Api.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.List;

@Data
public class TreinoRecorrenteDTO {

    private String modalidade;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private String local;
    private String professor;
    private Integer vagasTotais;

    private List<DayOfWeek> diasDaSemana;
}
