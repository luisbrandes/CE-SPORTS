package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.*;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.enums.ModalidadeEnum;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.ce.sports.Api.services.CampeonatoService;
import org.ce.sports.Api.services.ClassificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;

import org.ce.sports.Api.enums.ModalidadeEnum;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/campeonato")
public class CampeonatoController {

    private final CampeonatoRepository campeonatoRepository;
    private final EquipeRepository equipeRepository;
    private final ClassificacaoService classificacaoService;

    public CampeonatoController(CampeonatoRepository campeonatoRepository,
            EquipeRepository equipeRepository,
            ClassificacaoService classificacaoService) {
        this.campeonatoRepository = campeonatoRepository;
        this.equipeRepository = equipeRepository;
        this.classificacaoService = classificacaoService;
    }

    @PostMapping
    public ResponseEntity<?> adicionar(@Valid @RequestBody CampeonatoRequest request) {
        if (campeonatoRepository.existsByNome(request.nome())) {
            return ResponseEntity.status(409).body("Esse campeonato já existe");
        }

        if (request.equipes().size() < 2) {
            return ResponseEntity.badRequest().body("O campeonato deve ter pelo menos 2 equipes");
        }

        Set<Equipe> equipes = new HashSet<>();
        for (String nomeEquipe : request.equipes()) {
            Equipe equipe = equipeRepository.findByNome(nomeEquipe)
                    .orElseGet(() -> equipeRepository.save(
                            new Equipe(nomeEquipe, ModalidadeEnum.FUTEBOL) 
                    ));
            equipes.add(equipe);
        }

        Campeonato campeonato = new Campeonato(
                request.nome(),
                equipes,
                request.vitoria(),
                request.derrota(),
                request.empate());

        campeonatoRepository.save(campeonato);
        return ResponseEntity.status(201).build();
    }

    @GetMapping
    public ResponseEntity<List<CampeonatoResponse>> listarTodos() {
        List<CampeonatoResponse> resp = campeonatoRepository.findAll().stream()
                .map(c -> new CampeonatoResponse(
                        c.getId(),
                        c.getNome(),
                        c.getVitoria(),
                        c.getDerrota(),
                        c.getEmpate(),
                        c.getEquipes().stream()
                                .map(e -> new EquipeResponse(
                                        e.getId(),
                                        e.getNome(),
                                        e.getModalidade(),
                                        e.getDescricao(),
                                        e.getIntegrantes().size(),
                                        e.getCampeonatos().size(),
                                        e.isAtivo(),
                                        e.getIntegrantes().stream()
                                                .map(user -> user.getNome())
                                                .limit(3)
                                                .toList()))
                                .toList()))
                .toList();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampeonatoResponse> buscarPorId(@PathVariable Long id) {
        Optional<Campeonato> opt = campeonatoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Campeonato c = opt.get();
        CampeonatoResponse resp = new CampeonatoResponse(
                c.getId(),
                c.getNome(),
                c.getVitoria(),
                c.getDerrota(),
                c.getEmpate(),
                c.getEquipes().stream()
                        .map(e -> new EquipeResponse(
                                e.getId(),
                                e.getNome(),
                                e.getModalidade(),
                                e.getDescricao(),
                                e.getIntegrantes().size(),
                                e.getCampeonatos().size(),
                                e.isAtivo(),
                                e.getIntegrantes().stream()
                                        .map(user -> user.getNome())
                                        .limit(3)
                                        .toList()))
                        .toList());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}/classificacao")
    public ResponseEntity<List<ClassificacaoEquipe>> getClassificacao(@PathVariable Long id) {
        Optional<Campeonato> opt = campeonatoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<ClassificacaoEquipe> classificacao = classificacaoService.calcularClassificacao(opt.get());
        return ResponseEntity.ok(classificacao);
    }

    @PostMapping("/{id}/equipes")
    public ResponseEntity<?> adicionarEquipes(@PathVariable Long id, @RequestBody List<String> nomesEquipes) {
        Optional<Campeonato> opt = campeonatoRepository.findById(id);
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        Campeonato campeonato = opt.get();
        for (String nomeEquipe : nomesEquipes) {
            Equipe equipe = equipeRepository.findByNome(nomeEquipe)
                    .orElseGet(() -> equipeRepository.save(
                            new Equipe(nomeEquipe, ModalidadeEnum.FUTEBOL) // Modalidade padrão
                    ));
            campeonato.getEquipes().add(equipe);
        }

        campeonatoRepository.save(campeonato);
        return ResponseEntity.ok("Equipes adicionadas com sucesso!");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarParcial(
            @PathVariable Long id,
            @RequestBody CampeonatoPatchRequest request
    ) {
        campeonatoService.atualizarParcial(id, request);
        return ResponseEntity.ok("Campeonato atualizado (PATCH)!");
    }
}
