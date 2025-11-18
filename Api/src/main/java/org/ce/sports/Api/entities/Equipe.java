package org.ce.sports.Api.entities;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "equipes")
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

    public Equipe() {}

    public Equipe(String nome, Set<Campeonato> campeonatos, Set<User> integrantes) {
        this.nome = nome;
        this.campeonatos = campeonatos;
        this.integrantes = integrantes;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Campeonato> getCampeonatos() {
        return campeonatos;
    }

    public void setCampeonatos(Set<Campeonato> campeonatos) {
        this.campeonatos = campeonatos;
    }

    public Set<User> getIntegrantes() {
        return integrantes;
    }

    public void setIntegrantes(Set<User> integrantes) {
        this.integrantes = integrantes;
    }
}
