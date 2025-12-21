package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import lombok.*;
import org.ce.sports.Api.enums.ModalidadeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "equipes")
@Getter
@Setter
@AllArgsConstructor
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

    public <E> Equipe(String nomeEquipe, HashSet<E> es, HashSet<E> es1, ModalidadeEnum modalidadeEnum) {
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
