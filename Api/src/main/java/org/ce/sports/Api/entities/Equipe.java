package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import org.ce.sports.Api.enums.ModalidadeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "equipes")
@Getter
@Setter
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToMany(mappedBy = "equipes")
    @JsonIgnore
    private Set<Campeonato> campeonatos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "equipe_aluno",
            joinColumns = @JoinColumn(name = "equipe_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private Set<User> integrantes = new HashSet<>();

    private ModalidadeEnum modalidade;


    public Equipe() {
    }


    public Equipe(String nome,
                  Set<Campeonato> campeonatos,
                  Set<User> integrantes,
                  ModalidadeEnum modalidade) {
        this.nome = nome;
        this.campeonatos = campeonatos;
        this.integrantes = integrantes;
        this.modalidade = modalidade;
    }

}
