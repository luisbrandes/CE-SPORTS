package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import org.ce.sports.Api.enums.ModalidadeEnum;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "equipes")
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @ManyToMany(mappedBy = "equipes", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Campeonato> campeonatos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "equipe_aluno", joinColumns = @JoinColumn(name = "equipe_id"), inverseJoinColumns = @JoinColumn(name = "aluno_id"))
    private Set<User> integrantes = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModalidadeEnum modalidade;

    @Column(length = 500)
    private String descricao;

    @Column(name = "ativo", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean ativo = true;

    public Equipe() {
    }

    public Equipe(String nome, ModalidadeEnum modalidade) {
        this.nome = nome;
        this.modalidade = modalidade;
    }

    public Equipe(String nome, ModalidadeEnum modalidade, String descricao) {
        this.nome = nome;
        this.modalidade = modalidade;
        this.descricao = descricao;
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

    public ModalidadeEnum getModalidade() {
        return modalidade;
    }

    public void setModalidade(ModalidadeEnum modalidade) {
        this.modalidade = modalidade;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public void adicionarIntegrante(User aluno) {
        this.integrantes.add(aluno);
    }

    public void removerIntegrante(User aluno) {
        this.integrantes.remove(aluno);
    }

    public void adicionarCampeonato(Campeonato campeonato) {
        this.campeonatos.add(campeonato);
    }

    public void removerCampeonato(Campeonato campeonato) {
        this.campeonatos.remove(campeonato);
    }
}