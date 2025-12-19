package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.PropostaProjetoDTO;
import org.ce.sports.Api.dtos.PropostaProjetoResponse;
import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.services.PropostaProjetoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propostas")
@RequiredArgsConstructor
public class PropostaProjetoController {

    private final PropostaProjetoService service;

    @PostMapping
    public ResponseEntity<PropostaProjetoResponse> criar(
            @RequestBody PropostaProjetoDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(toResponse(
                service.criar(dto, auth.getName())
        ));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<PropostaProjetoResponse>> minhas(Authentication auth) {
        return ResponseEntity.ok(
                service.listarMinhas(auth.getName())
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PropostaProjetoResponse> editar(
            @PathVariable Long id,
            @RequestBody PropostaProjetoDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(toResponse(
                service.atualizar(id, dto, auth.getName())
        ));
    }

    @GetMapping
    public ResponseEntity<List<PropostaProjetoResponse>> listarTodas() {
        return ResponseEntity.ok(
                service.listarTodas()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    // ---------------------- CONVERSOR ----------------------
    private PropostaProjetoResponse toResponse(PropostaProjeto p) {
        return PropostaProjetoResponse.builder()
                .id(p.getId())
                .nome(p.getNome())
                .descricao(p.getDescricao())
                .modalidade(p.getModalidade())
                .local(p.getLocal())
                .dataInicio(p.getDataInicio())
                .dataFim(p.getDataFim())
                .status(p.getStatus().name())
                .alunoNome(p.getAluno().getNome())
                .build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            Authentication auth
    ) {
        service.excluir(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

}