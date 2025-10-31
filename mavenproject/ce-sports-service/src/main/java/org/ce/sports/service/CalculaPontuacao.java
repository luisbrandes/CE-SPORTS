package org.ce.sports.service;

import org.ce.sports.domain.Campeonato;

public class CalculaPontuacao {
	int pontuacao;
	Campeonato campeonato;
	
	public int Vitoria() {
		pontuacao += campeonato.getVitoria();
		
		return pontuacao;
	}
	
	public int Derrota() {
		pontuacao += campeonato.getDerrota();
		
		return pontuacao;
	}
	
	public int Empate() {
		pontuacao += campeonato.getEmpate();
		
		return pontuacao;
	}
}
