package org.ce.sports.Api.controllers;

import org.ce.sports.Api.dtos.AdicionarPartida;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.Partida;
import org.ce.sports.Api.entities.repositories.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partida")
public class PartidaController {

    private final PartidaRepository repository;

    public PartidaController(PartidaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<String> adicionar(@RequestBody AdicionarPartida partidaDto) {

        // 🔹 Criando objetos fictícios (mock) só com nomes para teste
        Campeonato campeonato = new Campeonato();
        campeonato.setNome(partidaDto.campeonato());

        Equipe equipe1 = new Equipe();
        equipe1.setNome(partidaDto.equipe1());

        Equipe equipe2 = new Equipe();
        equipe2.setNome(partidaDto.equipe2());

        // 🔹 Criando a entidade Partida com base no DTO
        Partida partida = new Partida(
            campeonato,
            equipe1,
            equipe2,
            partidaDto.pontuacao1(),
            partidaDto.pontuacao2()
        );

        repository.save(partida);

        return ResponseEntity.status(201).body("Partida criada com sucesso (dados fictícios).");
    }
}
