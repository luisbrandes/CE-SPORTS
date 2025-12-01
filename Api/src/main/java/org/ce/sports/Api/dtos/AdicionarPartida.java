package org.ce.sports.Api.dtos;

import java.time.LocalDate;

public record AdicionarPartida(String campeonato, String equipe1, String equipe2, int pontuacao1, int pontuacao2, LocalDate data) {

}
