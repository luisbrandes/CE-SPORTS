package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "campeonatos")
public class Campeonato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private int vitoria;
    private int derrota;
    private int empate;

    @OneToMany(mappedBy = "campeonato", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Equipe> equipes;

    public Campeonato() {}

    public Campeonato(String nome, Set<Equipe> equipes, int vitoria, int derrota, int empate) {
        this.nome = nome;
        this.equipes = equipes;
        this.vitoria = vitoria;
        this.derrota = derrota;
        this.empate = empate;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Set<Equipe> getEquipes() {
        return equipes;
    }

    public int getVitoria() {
        return vitoria;
    }

    public int getDerrota() {
        return derrota;
    }

    public int getEmpate() {
        return empate;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEquipes(Set<Equipe> equipes) {
        this.equipes = equipes;
    }

    public void setVitoria(int vitoria) {
        this.vitoria = vitoria;
    }

    public void setDerrota(int derrota) {
        this.derrota = derrota;
    }

    public void setEmpate(int empate) {
        this.empate = empate;
    }
}

