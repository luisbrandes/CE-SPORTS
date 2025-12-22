package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "treinos")
@Getter
@Setter
@ToString
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modalidade;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFim;

    @Column(nullable = false)
    private String local;

    @Column(nullable = false)
    private String professor;

    @Column(nullable = false)
    private Integer vagasTotais;

    @Column(nullable = false)
    private String status = "ATIVO";


    private LocalDate dataInicio;
    private LocalDate dataFim;


    private LocalDate data;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "treino_dias", joinColumns = @JoinColumn(name = "treino_id"))
    @Column(name = "dia_semana")
    private List<String> diasDaSemana;

    @Column(nullable = false)
    private boolean recorrente = false;

    @Transient
    private List<LocalDate> todasDatas;


}
