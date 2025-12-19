package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.PropostaProjetoDTO;
import org.ce.sports.Api.dtos.PropostaProjetoResponse;
import org.ce.sports.Api.dtos.PropostaResponseDTO;
import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.services.PropostaProjetoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propostas")
@RequiredArgsConstructor
public class PropostaProjetoController {

    private final PropostaProjetoService service;
    private final UserRepository userRepository;

    // ---------------------- CRIAR ----------------------
    @PostMapping
    public ResponseEntity<PropostaProjetoResponse> criar(
            @RequestBody PropostaProjetoDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(toResponse(
                service.criar(dto, auth.getName())
        ));
    }

    // ---------------------- MINHAS ----------------------
    @GetMapping("/minhas")
    public ResponseEntity<List<PropostaProjetoResponse>> minhas(Authentication auth) {
        return ResponseEntity.ok(
                service.listarMinhas(auth.getName())
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    // ---------------------- EDITAR ----------------------
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

    // ---------------------- LISTAR TODAS (COM AVALIAÇÕES) ----------------------
    @GetMapping
    public ResponseEntity<List<PropostaResponseDTO>> listar(Authentication auth) {

        User usuario = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return ResponseEntity.ok(
                service.listarComAvaliacoes(usuario)
        );
    }

    // ---------------------- EXCLUIR ----------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            Authentication auth
    ) {
        service.excluir(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // ---------------------- APROVAR (ADMIN) ----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        try {
            service.aprovar(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ---------------------- REJEITAR (ADMIN) ----------------------
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/rejeitar")
    public ResponseEntity<Void> rejeitar(@PathVariable Long id) {
        service.rejeitar(id);
        return ResponseEntity.ok().build();
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
}
