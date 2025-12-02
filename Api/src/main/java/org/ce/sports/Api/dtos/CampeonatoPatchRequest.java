package org.ce.sports.Api.dtos;

import java.util.Set;

public record CampeonatoPatchRequest(
        String nome,
        Integer vitoria,
        Integer derrota,
        Integer empate,
        Set<String> equipes
) {}
