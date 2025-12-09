package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ce.sports.Api.dtos.NewsCreateDTO;
import org.ce.sports.Api.dtos.NewsResponse;
import org.ce.sports.Api.dtos.NewsUpdateDTO;
import org.ce.sports.Api.entities.News;
import org.ce.sports.Api.entities.repositories.NewsRepository;
import org.ce.sports.Api.services.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
@Slf4j
public class NewsController {

    private final NewsService service;
    private final NewsRepository repository;

    // ---------------------------- CRIAR ----------------------------
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody NewsCreateDTO dto) {
        try {
            News criada = service.criar(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(toResponse(criada));
        } catch (Exception e) {
            log.error("Erro ao criar notícia", e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao criar notícia: " + e.getMessage()));
        }
    }

    // ---------------------------- LISTAR ----------------------------
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<NewsResponse> lista = repository.findAll()
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            log.error("Erro ao listar notícias", e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao listar notícias: " + e.getMessage()));
        }
    }

    // ---------------------------- BUSCAR POR ID ----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return repository.findById(id)
                    .map(n -> {
                        try {
                            return ResponseEntity.ok(toResponse(n));
                        } catch (Exception e) {
                            e.printStackTrace();
                            return ResponseEntity.status(500)
                                    .body(Map.of("error", "Erro ao converter dados: " + e.getMessage()));
                        }
                    })
                    .orElse(
                            ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(Map.of("error", "Notícia não encontrada"))
                    );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao buscar notícia: " + e.getMessage()));
        }
    }



    // ---------------------------- PUT ----------------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody NewsUpdateDTO dto) {

        try {
            News atualizada = service.atualizar(id, dto);
            return ResponseEntity.ok(toResponse(atualizada));
        } catch (Exception e) {
            log.error("Erro ao atualizar notícia {}", id, e);
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ---------------------------- PATCH ----------------------------
    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarParcial(
            @PathVariable Long id,
            @RequestBody NewsUpdateDTO dto) {

        try {
            News atualizada = service.atualizarParcial(id, dto);
            return ResponseEntity.ok(toResponse(atualizada));
        } catch (Exception e) {
            log.error("Erro ao aplicar patch na notícia {}", id, e);
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ---------------------------- DELETE ----------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.ok(Map.of("message", "Notícia deletada com sucesso"));
        } catch (Exception e) {
            log.error("Erro ao deletar notícia {}", id, e);
            return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ---------------------------- CONVERSOR ----------------------------
    private NewsResponse toResponse(News n) {
        return NewsResponse.builder()
                .id(n.getId())
                .titulo(n.getTitulo())
                .conteudo(n.getConteudo())
                .esporte(n.getEsporte())
                .autorId(n.getAutorId())
                .autorNome(n.getAutorNome())
                .criadaEm(n.getCriadaEm())
                .build();
    }
}
