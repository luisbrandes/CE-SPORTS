package org.ce.sports.Api.dtos;

import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;

public record AdicionarPartida(String campeonato, String equipe1, String equipe2, int pontuacao1, int pontuacao2) {

}
