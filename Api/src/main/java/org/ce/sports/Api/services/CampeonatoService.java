package org.ce.sports.Api.services;

import jakarta.transaction.Transactional;
import org.ce.sports.Api.dtos.CampeonatoPatchRequest;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class CampeonatoService {

    private final CampeonatoRepository campeonatoRepository;
    private final EquipeRepository equipeRepository;

    public CampeonatoService(CampeonatoRepository campeonatoRepository, EquipeRepository equipeRepository) {
        this.campeonatoRepository = campeonatoRepository;
        this.equipeRepository = equipeRepository;
    }

    @Transactional
    public void atualizarParcial(Long id, CampeonatoPatchRequest request) {

        Campeonato campeonato = campeonatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));

        if (request.nome() != null && !request.nome().isBlank()) {
            campeonato.setNome(request.nome());
        }

        if (request.vitoria() != null) {
            campeonato.setVitoria(request.vitoria());
        }

        if (request.derrota() != null) {
            campeonato.setDerrota(request.derrota());
        }

        if (request.empate() != null) {
            campeonato.setEmpate(request.empate());
        }

        if (request.equipes() != null) {
            Set<Equipe> novasEquipes = new HashSet<>();
            for (String nomeEquipe : request.equipes()) {
                Equipe equipe = equipeRepository.findByNome(nomeEquipe)
                        .orElseGet(() -> equipeRepository.save(
                                new Equipe(nomeEquipe, new HashSet<>(), new HashSet<>())
                        ));
                novasEquipes.add(equipe);
            }
            campeonato.setEquipes(novasEquipes);
        }

        campeonatoRepository.save(campeonato);
    }


}
