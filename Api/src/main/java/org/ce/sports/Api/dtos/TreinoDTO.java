package org.ce.sports.Api.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

public class TreinoDTO {
    private String modalidade;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private String local;
    private String professor;
    private Integer vagasTotais;

    public TreinoDTO() {}

    public TreinoDTO(String modalidade, LocalDate data, LocalTime horaInicio, LocalTime horaFim,
                     String local, String professor, Integer vagasTotais) {
        this.modalidade = modalidade;
        this.data = data;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.local = local;
        this.professor = professor;
        this.vagasTotais = vagasTotais;
    }

    public String getModalidade() { return modalidade; }
    public void setModalidade(String modalidade) { this.modalidade = modalidade; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFim() { return horaFim; }
    public void setHoraFim(LocalTime horaFim) { this.horaFim = horaFim; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public String getProfessor() { return professor; }
    public void setProfessor(String professor) { this.professor = professor; }

    public Integer getVagasTotais() { return vagasTotais; }
    public void setVagasTotais(Integer vagasTotais) { this.vagasTotais = vagasTotais; }
}
