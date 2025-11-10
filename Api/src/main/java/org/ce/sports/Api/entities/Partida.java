package org.ce.sports.Api.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "campeonato_id")
    private Campeonato campeonato;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipe_vencedora_id")
    private Equipe vencedor;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipe_perdedora_id")
    private Equipe perdedor;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipe1_id")
    private Equipe equipe1;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipe2_id")
    private Equipe equipe2;

    private int pontuacao1;
    private int pontuacao2;
    private boolean empate;

    public Partida() {}

    public Partida(Campeonato campeonato, Equipe equipe1, Equipe equipe2, int pontuacao1, int pontuacao2) {
        this.campeonato = campeonato;
        this.equipe1 = equipe1;
        this.equipe2 = equipe2;
        this.pontuacao1 = pontuacao1;
        this.pontuacao2 = pontuacao2;

        if(pontuacao1 == pontuacao2){
            this.empate = true;
        }else if(pontuacao1 > pontuacao2){
            this.vencedor = this.equipe1;
            this.perdedor = this.equipe2;
        }else{
            this.vencedor = this.equipe2;
            this.perdedor = this.equipe1;
        }
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

    public int getPontuacao1() {
        return pontuacao1;
    }

    public void setPontuacao1(int pontuacao1) {
        this.pontuacao1 = pontuacao1;
    }

    public int getPontuacao2() {
        return pontuacao2;
    }

    public void setPontuacao2(int pontuacao2) {
        this.pontuacao2 = pontuacao2;
    }

    public boolean isEmpate() {
        return empate;
    }

    public void setEmpate(boolean empate) {
        this.empate = empate;
    }
}
