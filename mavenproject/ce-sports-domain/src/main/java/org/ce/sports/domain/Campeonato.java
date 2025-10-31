package org.ce.sports.domain;

public class Campeonato {
	String nome;
	int vitoria, derrota, empate;
	Equipe[] equipes;
	
	public Campeonato(String nome, Equipe[] equipes, int vitoria, int derrota, int empate) {
		this.nome = nome;
		this.equipes = equipes;
		this.vitoria = vitoria;
		this.derrota = derrota;
		this.empate = empate;
	}
	
	public String getNome() {
		return nome;
	}
	
	public Equipe[] getEquipes() {
		return equipes;
	}
	
	public int getVitoria() {
		return vitoria;
	}
	
	public int getDerrota() {
		return vitoria;
	}
	
	public int getEmpate() {
		return vitoria;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public void setEquipes(Equipe[] equipes) {
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
