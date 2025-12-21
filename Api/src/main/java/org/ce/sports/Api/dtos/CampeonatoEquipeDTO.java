package org.ce.sports.Api.dtos;

public record CampeonatoEquipeDTO(
        Long id,
        String nome,
        Integer colocacao,
        Integer pontos) {
}