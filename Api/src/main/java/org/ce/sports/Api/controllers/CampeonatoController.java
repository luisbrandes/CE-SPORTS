package org.ce.sports.Api.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.ce.sports.Api.dtos.CampeonatoRequest;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/campeonato")
public class CampeonatoController {
    private final CampeonatoRepository campeonatoRepository;
    private final EquipeRepository equipeRepository;

    public CampeonatoController(CampeonatoRepository campeonatoRepository, EquipeRepository equipeRepository) {
        this.campeonatoRepository = campeonatoRepository;
        this.equipeRepository = equipeRepository;
    }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody CampeonatoRequest request) {
        Set<Equipe> equipes = new HashSet<>();

        for (String nomeEquipe : request.equipes()) {
            Equipe equipe = equipeRepository.findByNome(nomeEquipe)
                .orElseGet(() -> equipeRepository.save(new Equipe(nomeEquipe, new HashSet<>(), new HashSet<>())));

            equipes.add(equipe);
        }

        Campeonato campeonato = new Campeonato(
                request.nome(),
                equipes,
                request.vitoria(),
                request.derrota(),
                request.empate()
        );

        campeonatoRepository.save(campeonato);
        return ResponseEntity.status(201).build();
    }

    @GetMapping
    public ResponseEntity<List<Campeonato>> listarTodos() {
        return ResponseEntity.ok(campeonatoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return campeonatoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/equipes")
    public ResponseEntity<?> adicionarEquipes(@PathVariable Long id, @RequestBody List<String> nomesEquipes) {
        Optional<Campeonato> opt = campeonatoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Campeonato campeonato = opt.get();

        for (String nomeEquipe : nomesEquipes) {
            Equipe equipe = equipeRepository.findByNome(nomeEquipe)
                    .orElseGet(() -> equipeRepository.save(new Equipe(nomeEquipe, new HashSet<>(), new HashSet<>())));
            campeonato.getEquipes().add(equipe);
        }

        campeonatoRepository.save(campeonato);
        return ResponseEntity.ok("Equipes adicionadas com sucesso!");
    }
}
