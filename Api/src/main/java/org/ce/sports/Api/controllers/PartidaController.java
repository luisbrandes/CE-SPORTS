package org.ce.sports.Api.controllers;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.ce.sports.Api.dtos.AdicionarPartida;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.Partida;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.ce.sports.Api.entities.repositories.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partida")
public class PartidaController {

    private final PartidaRepository repository;
    private final CampeonatoRepository campeonatoRepository;
    private final EquipeRepository equipeRepository;

    public PartidaController(
        PartidaRepository repository,
        CampeonatoRepository campeonatoRepository,
        EquipeRepository equipeRepository
    ) {
        this.repository = repository;
        this.campeonatoRepository = campeonatoRepository;
        this.equipeRepository = equipeRepository;
    }

    @PostMapping
    public ResponseEntity<String> adicionar(@RequestBody AdicionarPartida partidaDto) {
        LocalDate hoje = LocalDate.now();
        LocalDate umAnoAtras = hoje.minusYears(1);

        if (partidaDto.data().isAfter(hoje)) {
            return ResponseEntity.badRequest().body("A data da partida não pode ser no futuro.");
        }

        if (partidaDto.data().isBefore(umAnoAtras)) {
            return ResponseEntity.badRequest().body("A data da partida não pode ser superior a 1 ano atrás.");
        }

        Campeonato campeonato = campeonatoRepository.findByNomeComEquipes(partidaDto.campeonato())
                .orElse(null);

        if (campeonato == null) {
            return ResponseEntity.badRequest().body("Campeonato não encontrado.");
        }

        // Buscar equipes
        Equipe equipe1 = equipeRepository.findByNome(partidaDto.equipe1()).orElse(null);
        Equipe equipe2 = equipeRepository.findByNome(partidaDto.equipe2()).orElse(null);

        if (equipe1 == null || equipe2 == null) {
            return ResponseEntity.badRequest().body("Uma ou ambas as equipes não existem.");
        }

        if (equipe1.getId().equals(equipe2.getId())) {
            return ResponseEntity.badRequest().body("Uma equipe não pode jogar contra ela mesma.");
        }

        boolean equipe1NoCampeonato = campeonato.getEquipes()
                .stream().anyMatch(e -> e.getId().equals(equipe1.getId()));

        boolean equipe2NoCampeonato = campeonato.getEquipes()
                .stream().anyMatch(e -> e.getId().equals(equipe2.getId()));

        if (!equipe1NoCampeonato || !equipe2NoCampeonato) {
            return ResponseEntity.badRequest().body("As equipes precisam fazer parte do campeonato.");
        }

        Partida partida = new Partida(
            campeonato,
            equipe1,
            equipe2,
            partidaDto.pontuacao1(),
            partidaDto.pontuacao2(),
            partidaDto.data()
        );

        repository.save(partida);

        return ResponseEntity.created(URI.create("/api/partida")).build();
    }

    @GetMapping
    public ResponseEntity<List<Partida>> listarTodas() {
        List<Partida> partidas = repository.findAllWithDetails();
        return ResponseEntity.ok(partidas);
    }
}