package org.ce.sports.Api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ce.sports.Api.services.ProjetoEsportivoService;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.dtos.ProjetoEsportivoDTO;

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = "*")
public class ProjetoEsportivoController {

    @Autowired
    private ProjetoEsportivoService service;

    @PostMapping
    public ResponseEntity<ProjetoEsportivo> criarProjeto(@RequestBody ProjetoEsportivoDTO dto) {
        ProjetoEsportivo novo = service.criarProjeto(dto);
        return ResponseEntity.ok(novo);
    }
}