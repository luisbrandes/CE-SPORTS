package org.ce.sports.Api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ce.sports.Api.services.TreinoService;
import org.ce.sports.Api.dtos.TreinoDTO;
import org.ce.sports.Api.dtos.TreinoRecorrenteDTO;
import org.ce.sports.Api.entities.Treino;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> obterTreino(@PathVariable Long id) {
        try {
            Treino treino = treinoService.obterTreino(id);
            if (treino == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(treino);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erro ao carregar treino: " + e.getMessage()));
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

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarTreino(@PathVariable Long id, @RequestBody TreinoDTO dto) {
        try {
            Treino atualizado = treinoService.atualizarTreino(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao atualizar treino: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarTreino(@PathVariable Long id) {
        try {
            treinoService.deletarTreino(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao deletar treino: " + e.getMessage()));
        }
    }
}
