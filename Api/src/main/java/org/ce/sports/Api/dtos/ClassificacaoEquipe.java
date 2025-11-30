package org.ce.sports.Api.dtos;

public record ClassificacaoEquipe(
    String nomeEquipe,
    int pontos,
    int jogos,
    int vitorias,
    int derrotas,
    int empates,
    int golsPro,
    int golsContra,
    int saldoGols
) {}