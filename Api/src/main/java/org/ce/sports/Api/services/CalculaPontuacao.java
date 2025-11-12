package org.ce.sports.Api.services;

import org.ce.sports.Api.entities.Campeonato;
import org.springframework.stereotype.Service;

@Service
public class CalculaPontuacao {

    public int calcularPontuacaoVitoria(Campeonato campeonato) {
        return campeonato.getVitoria();
    }

    public int calcularPontuacaoDerrota(Campeonato campeonato) {
        return campeonato.getDerrota();
    }

    public int calcularPontuacaoEmpate(Campeonato campeonato) {
        return campeonato.getEmpate();
    }
}