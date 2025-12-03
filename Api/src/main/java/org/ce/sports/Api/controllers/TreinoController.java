package org.ce.sports.Api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ce.sports.Api.services.TreinoService;
import org.ce.sports.Api.dtos.TreinoDTO;
import org.ce.sports.Api.dtos.TreinoRecorrenteDTO;
import org.ce.sports.Api.entities.Treino;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
public class TreinoController {

    @Autowired
    private TreinoService treinoService;

    @GetMapping
    public ResponseEntity<?> listarTreinos() {
        try {
            return ResponseEntity.ok(treinoService.listarTreinos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao carregar treinos");
        }
    }

    @PostMapping
    public ResponseEntity<?> criarTreino(@RequestBody TreinoDTO dto) {
        try {
            return ResponseEntity.ok(treinoService.criarTreino(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/recorrentes")
    public ResponseEntity<?> criarTreinosRecorrentes(@RequestBody TreinoRecorrenteDTO dto) {
        try {
            treinoService.criarTreinosRecorrentes(dto);
            return ResponseEntity.ok("Treino recorrente criado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
