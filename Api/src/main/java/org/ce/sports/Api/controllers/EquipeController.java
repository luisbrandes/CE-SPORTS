package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.*;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.enums.ModalidadeEnum;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.services.EquipeService;
import org.ce.sports.Api.services.ClassificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/equipe")
public class EquipeController {

    private final EquipeRepository equipeRepository;
    private final UserRepository userRepository;
    private final CampeonatoRepository campeonatoRepository;
    private final EquipeService equipeService;
    private final ClassificacaoService classificacaoService;

    @GetMapping
    public ResponseEntity<List<EquipeResponse>> listarTodas() {
        List<Equipe> equipes = equipeRepository.findAll();

        List<EquipeResponse> response = equipes.stream()
                .map(e -> new EquipeResponse(
                        e.getId(),
                        e.getNome(),
                        e.getModalidade(),
                        e.getDescricao(),
                        e.getIntegrantes().size(),
                        e.getCampeonatos().size(),
                        e.isAtivo(),
                        e.getIntegrantes().stream()
                                .map(User::getNome)
                                .limit(3) // Mostrar apenas 3 nomes
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipeDetalhesResponse> buscarPorId(@PathVariable Long id) {
        return equipeRepository.findById(id)
                .map(equipe -> {
                    List<CampeonatoEquipeDTO> campeonatosComColocacao = equipe.getCampeonatos().stream()
                            .map(campeonato -> {
                                List<ClassificacaoEquipe> classificacao = classificacaoService
                                        .calcularClassificacao(campeonato);

                                Integer colocacao = null;
                                Integer pontos = null;

                                for (int i = 0; i < classificacao.size(); i++) {
                                    if (classificacao.get(i).nomeEquipe().equals(equipe.getNome())) {
                                        colocacao = i + 1;
                                        pontos = classificacao.get(i).pontos();
                                        break;
                                    }
                                }

                                return new CampeonatoEquipeDTO(
                                        campeonato.getId(),
                                        campeonato.getNome(),
                                        colocacao,
                                        pontos);
                            })
                            .collect(Collectors.toList());

                    List<IntegranteDTO> integrantesDTO = equipe.getIntegrantes().stream()
                            .map(user -> new IntegranteDTO(
                                    user.getId(),
                                    user.getNome(),
                                    user.getEmail()))
                            .collect(Collectors.toList());

                    return new EquipeDetalhesResponse(
                            equipe.getId(),
                            equipe.getNome(),
                            equipe.getModalidade(),
                            equipe.getDescricao(),
                            equipe.isAtivo(),
                            integrantesDTO,
                            campeonatosComColocacao);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criarEquipe(@Valid @RequestBody EquipeRequest request) {
        if (equipeRepository.findByNome(request.nome()).isPresent()) {
            return ResponseEntity.status(409).body("Já existe uma equipe com este nome");
        }

        Equipe equipe = new Equipe(
                request.nome(),
                request.modalidade(),
                request.descricao());

        if (request.integrantesIds() != null && !request.integrantesIds().isEmpty()) {
            Set<User> integrantes = new HashSet<>();
            for (Long userId : request.integrantesIds()) {
                userRepository.findById(userId).ifPresent(integrantes::add);
            }
            equipe.setIntegrantes(integrantes);
        }

        equipeRepository.save(equipe);
        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirEquipe(@PathVariable Long id) {
        Optional<Equipe> equipeOpt = equipeRepository.findById(id);

        if (equipeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipe equipe = equipeOpt.get();

        for (Campeonato campeonato : equipe.getCampeonatos()) {
            campeonato.getEquipes().remove(equipe);
            campeonatoRepository.save(campeonato);
        }

        equipe.getIntegrantes().clear();
        equipeRepository.save(equipe);

        equipeRepository.delete(equipe);

        return ResponseEntity.ok("Equipe excluída com sucesso");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarEquipe(
            @PathVariable Long id,
            @Valid @RequestBody EquipePatchRequest request) {

        return equipeRepository.findById(id)
                .map(equipe -> {
                    if (request.nome() != null && !request.nome().isBlank()) {
                        // Verificar se novo nome não conflita com outras equipes
                        if (!equipe.getNome().equals(request.nome()) &&
                                equipeRepository.findByNome(request.nome()).isPresent()) {
                            return ResponseEntity.status(409)
                                    .body("Já existe uma equipe com este nome");
                        }
                        equipe.setNome(request.nome());
                    }

                    if (request.modalidade() != null) {
                        equipe.setModalidade(request.modalidade());
                    }

                    if (request.descricao() != null) {
                        equipe.setDescricao(request.descricao());
                    }

                    if (request.ativo() != null) {
                        equipe.setAtivo(request.ativo());
                    }

                    if (request.integrantesIds() != null) {
                        Set<User> novosIntegrantes = new HashSet<>();
                        for (Long userId : request.integrantesIds()) {
                            userRepository.findById(userId).ifPresent(novosIntegrantes::add);
                        }
                        equipe.setIntegrantes(novosIntegrantes);
                    }

                    equipeRepository.save(equipe);

                    EquipeResponse response = new EquipeResponse(
                            equipe.getId(),
                            equipe.getNome(),
                            equipe.getModalidade(),
                            equipe.getDescricao(),
                            equipe.getIntegrantes().size(),
                            equipe.getCampeonatos().size(),
                            equipe.isAtivo(),
                            equipe.getIntegrantes().stream()
                                    .map(User::getNome)
                                    .limit(3)
                                    .collect(Collectors.toList()));

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{equipeId}/campeonatos/{campeonatoId}")
    public ResponseEntity<?> adicionarAoCampeonato(
            @PathVariable Long equipeId,
            @PathVariable Long campeonatoId) {

        Optional<Equipe> equipeOpt = equipeRepository.findById(equipeId);
        Optional<Campeonato> campeonatoOpt = campeonatoRepository.findById(campeonatoId);

        if (equipeOpt.isEmpty() || campeonatoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipe equipe = equipeOpt.get();
        Campeonato campeonato = campeonatoOpt.get();

        if (equipe.getCampeonatos().contains(campeonato)) {
            return ResponseEntity.status(409)
                    .body("Equipe já está inscrita neste campeonato");
        }

        equipe.adicionarCampeonato(campeonato);
        campeonato.getEquipes().add(equipe);

        equipeRepository.save(equipe);
        campeonatoRepository.save(campeonato);

        return ResponseEntity.ok("Equipe adicionada ao campeonato com sucesso");
    }

    @DeleteMapping("/{equipeId}/campeonatos/{campeonatoId}")
    public ResponseEntity<?> removerDoCampeonato(
            @PathVariable Long equipeId,
            @PathVariable Long campeonatoId) {

        Optional<Equipe> equipeOpt = equipeRepository.findById(equipeId);
        Optional<Campeonato> campeonatoOpt = campeonatoRepository.findById(campeonatoId);

        if (equipeOpt.isEmpty() || campeonatoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipe equipe = equipeOpt.get();
        Campeonato campeonato = campeonatoOpt.get();

        if (!equipe.getCampeonatos().contains(campeonato)) {
            return ResponseEntity.status(404)
                    .body("Equipe não está inscrita neste campeonato");
        }

        equipe.removerCampeonato(campeonato);
        campeonato.getEquipes().remove(equipe);

        equipeRepository.save(equipe);
        campeonatoRepository.save(campeonato);

        return ResponseEntity.ok("Equipe removida do campeonato com sucesso");
    }

    @GetMapping("/modalidade/{modalidade}")
    public ResponseEntity<List<EquipeResponse>> listarPorModalidade(
            @PathVariable String modalidade) {

        try {
            ModalidadeEnum modalidadeEnum = ModalidadeEnum.valueOf(modalidade.toUpperCase());
            List<Equipe> equipes = equipeRepository.findByModalidade(modalidadeEnum);

            List<EquipeResponse> response = equipes.stream()
                    .map(e -> new EquipeResponse(
                            e.getId(),
                            e.getNome(),
                            e.getModalidade(),
                            e.getDescricao(),
                            e.getIntegrantes().size(),
                            e.getCampeonatos().size(),
                            e.isAtivo(),
                            e.getIntegrantes().stream()
                                    .map(User::getNome)
                                    .limit(3)
                                    .collect(Collectors.toList())))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}