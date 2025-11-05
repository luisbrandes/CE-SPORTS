package org.ce.sports.Api.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campeonato_id")
    private Campeonato campeonato;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipe_vencedora_id")
    private Equipe vencedor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipe_perdedora_id")
    private Equipe perdedor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipe1_id")
    private Equipe equipe1;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipe2_id")
    private Equipe equipe2;

    private int gols1;
    private int gols2;
    private boolean empate;

    public Partida() {}

    public Partida(Campeonato campeonato, Equipe vencedor, Equipe perdedor, Equipe equipe1, Equipe equipe2, int gols1, int gols2, boolean empate) {
        this.campeonato = campeonato;
        this.vencedor = vencedor;
        this.perdedor = perdedor;
        this.equipe1 = equipe1;
        this.equipe2 = equipe2;
        this.gols1 = gols1;
        this.gols2 = gols2;
        this.empate = empate;
    }

    public Long getId() {
        return id;
    }

    public Campeonato getCampeonato() {
        return campeonato;
    }

    public void setCampeonato(Campeonato campeonato) {
        this.campeonato = campeonato;
    }

    public Equipe getVencedor() {
        return vencedor;
    }

    public void setVencedor(Equipe vencedor) {
        this.vencedor = vencedor;
    }

    public Equipe getPerdedor() {
        return perdedor;
    }

    public void setPerdedor(Equipe perdedor) {
        this.perdedor = perdedor;
    }

    public Equipe getEquipe1() {
        return equipe1;
    }

    public void setEquipe1(Equipe equipe1) {
        this.equipe1 = equipe1;
    }

    public Equipe getEquipe2() {
        return equipe2;
    }

    public void setEquipe2(Equipe equipe2) {
        this.equipe2 = equipe2;
    }

    public int getGols1() {
        return gols1;
    }

    public void setGols1(int gols1) {
        this.gols1 = gols1;
    }

    public int getGols2() {
        return gols2;
    }

    public void setGols2(int gols2) {
        this.gols2 = gols2;
    }

    public boolean isEmpate() {
        return empate;
    }

    public void setEmpate(boolean empate) {
        this.empate = empate;
    }
}
