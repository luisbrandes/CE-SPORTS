package org.ce.sports.Api.dtos;

import java.util.List;

public record CampeonatoResponse(
    Long id,
    String nome,
    int vitoria,
    int derrota,
    int empate,
    List<String> equipes
) {}