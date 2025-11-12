package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projetos_esportivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetoEsportivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(length = 1000)
    private String descricao;

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String local;
    private String modalidade;
    private String responsavel;
}