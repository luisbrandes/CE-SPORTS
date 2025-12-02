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
@CrossOrigin(origins = "*")
public class TreinoController {

    @Autowired
    private TreinoService treinoService;

    @GetMapping
    public ResponseEntity<?> listarTreinos() {
        try {
            List<Treino> treinos = treinoService.listarTreinos();
            return ResponseEntity.ok(treinos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao carregar treinos");
        }
    }

    @PostMapping
    public ResponseEntity<?> criarTreino(@RequestBody TreinoDTO dto) {
        try {
            Treino treino = treinoService.criarTreino(dto);
            return ResponseEntity.ok(treino);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno no servidor");
        }
    }

    @PostMapping("/recorrentes")
    public ResponseEntity<?> criarTreinosRecorrentes(@RequestBody TreinoRecorrenteDTO dto) {
        try {
            treinoService.criarTreinosRecorrentes(dto);
            return ResponseEntity.ok("Treinos recorrentes criados com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno no servidor");
        }
    }
}
