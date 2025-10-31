package org.ce.sports.domain;

import org.ce.sports.service.CalculaPontuacao;

public class Equipe {
	String nome;
	Campeonato[] campeonatos;
	Aluno[] integrantes;
	CalculaPontuacao[] pontos;
	
	public Equipe(String nome, Campeonato[] campeonatos, Aluno[] integrantes, CalculaPontuacao[] pontos) {
		this.nome = nome;
		this.campeonatos = campeonatos;
		this.integrantes = integrantes;
		this.pontos = pontos;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Campeonato[] getCampeonatos() {
		return campeonatos;
	}

	public void setCampeonatos(Campeonato[] campeonatos) {
		this.campeonatos = campeonatos;
	}

	public Aluno[] getIntegrantes() {
		return integrantes;
	}

	public void setIntegrantes(Aluno[] integrantes) {
		this.integrantes = integrantes;
	}

	public CalculaPontuacao[] getPontos() {
		return pontos;
	}

	public void setPontos(CalculaPontuacao[] pontos) {
		this.pontos = pontos;
	}
}
