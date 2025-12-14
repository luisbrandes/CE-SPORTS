package org.ce.sports.Api.dtos;

import java.util.Set;

import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.ModalidadeEnum;

public record EquipeRequest(
        String nome,
        Set<Campeonato> campeonatos,
        Set<User> integrantes,
        ModalidadeEnum modalidade) {
}
