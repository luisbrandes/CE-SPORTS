package org.ce.sports.Api.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.AvaliacaoRequest;
import org.ce.sports.Api.dtos.AvaliacaoResponse;
import org.ce.sports.Api.dtos.PropostaResponseDTO;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.services.AvaliacaoPropostaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propostas")
@RequiredArgsConstructor
public class AvaliacaoPropostaController {

    private final AvaliacaoPropostaService avaliacaoService;

    @PostMapping("/{id}/avaliar")
    public ResponseEntity<AvaliacaoResponse> avaliar(
            @PathVariable Long id,
            @Valid @RequestBody AvaliacaoRequest dto,
            Authentication auth
    ) {
        Double media = avaliacaoService.avaliar(id, dto, auth.getName());

        return ResponseEntity.ok(
                new AvaliacaoResponse(id, media)
        );
    }


}
