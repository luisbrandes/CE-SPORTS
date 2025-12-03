package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.ProjetoEsportivoDTO;
import org.ce.sports.Api.dtos.ProjetoEsportivoResponse;
import org.ce.sports.Api.dtos.ProjetoUpdateDTO;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.entities.repositories.ProjetoEsportivoRepository;
import org.ce.sports.Api.services.ProjetoEsportivoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projetos")
@RequiredArgsConstructor
public class ProjetoEsportivoController {

    private final ProjetoEsportivoService service;
    private final ProjetoEsportivoRepository projetoRepository;

    // ----------- CRIAR PROJETO -----------
    @PostMapping
    public ResponseEntity<ProjetoEsportivoResponse> criarProjeto(@RequestBody ProjetoEsportivoDTO dto) {
        ProjetoEsportivo criado = service.criarProjeto(dto);
        return ResponseEntity.ok(toResponse(criado));
    }

    // ----------- LISTAR TODOS -----------
    @GetMapping
    public ResponseEntity<List<ProjetoEsportivoResponse>> listarProjetos() {
        List<ProjetoEsportivoResponse> lista = projetoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lista);
    }

    // ----------- BUSCAR POR ID -----------
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjetoById(@PathVariable Long id) {
        try {
            return projetoRepository.findById(id)
                    .map(p -> {
                        try {
                            return ResponseEntity.ok(toResponse(p));
                        } catch (Exception e) {
                            e.printStackTrace();
                            return ResponseEntity.status(500)
                                    .body(Map.of("error", "Erro ao converter dados: " + e.getMessage()));
                        }
                    })
                    .orElse(
                            ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(Map.of("error", "Projeto não encontrado"))
                    );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao buscar projeto: " + e.getMessage()));
        }
    }



    // ----------- ATUALIZAR (PATCH) -----------
    @PatchMapping("/{id}")
    public ResponseEntity<Object> atualizarProjeto(
            @PathVariable Long id,
            @RequestBody ProjetoUpdateDTO dto) {

        try {
            ProjetoEsportivo atualizado = service.atualizarProjeto(id, dto);
            return ResponseEntity.ok(toResponse(atualizado));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ----------- DELETAR -----------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProjeto(@PathVariable Long id) {
        service.deletarProjeto(id);
        return ResponseEntity.noContent().build();
    }

    // ----------- INSCREVER -----------
    @PostMapping("/{projetoId}/inscrever")
    public ResponseEntity<Object> inscrever(@PathVariable Long projetoId, Authentication auth) {
        try {
            ProjetoEsportivo p = service.inscreverAluno(projetoId, auth.getName());
            return ResponseEntity.ok(toResponse(p));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ----------- CANCELAR INSCRIÇÃO -----------
    @PostMapping("/{projetoId}/cancelar")
    public ResponseEntity<Object> cancelar(@PathVariable Long projetoId, Authentication auth) {
        try {
            ProjetoEsportivo p = service.cancelarInscricao(projetoId, auth.getName());
            return ResponseEntity.ok(toResponse(p));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ----------- PROJETOS QUE O ALUNO ESTÁ INSCRITO -----------
    @GetMapping("/inscritos")
    public ResponseEntity<List<Long>> meusInscritos(Authentication auth) {
        List<Long> lista = service.listarProjetosInscritos(auth.getName());
        return ResponseEntity.ok(lista);
    }

    // ----------- CONVERSOR PARA RESPONSE DTO -----------
    private ProjetoEsportivoResponse toResponse(ProjetoEsportivo p) {
        return ProjetoEsportivoResponse.builder()
                .id(p.getId())
                .nome(p.getNome())
                .descricao(p.getDescricao())
                .modalidade(p.getModalidade())
                .local(p.getLocal())
                .dataInicio(p.getDataInicio())
                .dataFim(p.getDataFim())
                .responsavel(p.getResponsavel())
                .vagasTotais(p.getVagasTotais())
                .vagasPreenchidas(p.getVagasPreenchidas())
                .build();
    }
}
