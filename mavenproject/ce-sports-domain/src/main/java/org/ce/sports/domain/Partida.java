package org.ce.sports.domain;

public class Partida {
<<<<<<< HEAD
	Campeonato campeonato;
	Equipe vencedor, perdedor, equipe1, equipe2;
	int gols1, gols2;
	boolean empate;

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
=======

>>>>>>> a2c7b6a (Organizacao da branch e adicao de spring boot)
}
