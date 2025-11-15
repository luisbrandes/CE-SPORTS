package org.ce.sports.Api.dtos;

import java.util.List;

public record CampeonatoRequest(
    String nome,
    List<String> equipes,
    int vitoria,
    int derrota,
    int empate
) {}