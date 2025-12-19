package org.ce.sports.Api.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.ce.sports.Api.entities.User;

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

    @Column(nullable = false)
    private Integer vagasTotais = 0;

    @Column(nullable = false)
    private Integer vagasPreenchidas = 0;

    @ManyToMany
    @JoinTable(
            name = "projeto_inscricoes",
            joinColumns = @JoinColumn(name = "projeto_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> inscritos = new HashSet<>();
}
