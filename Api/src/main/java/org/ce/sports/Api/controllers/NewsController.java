package org.ce.sports.Api.controllers;


import org.ce.sports.Api.entities.News;
import org.ce.sports.Api.entities.repositories.NewsRepository;
import org.ce.sports.Api.services.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService noticiaService;
    private final NewsRepository noticiaRepository;

    public NewsController(NewsService noticiaService, NewsRepository noticiaRepository) {
        this.noticiaService = noticiaService;
        this.noticiaRepository = noticiaRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> cadastrarNoticia(
            @RequestParam String titulo,
            @RequestParam String autor,
            @RequestParam String dataPublicacao,
            @RequestParam String descricao,
            @RequestParam String conteudo,
            @RequestParam(required = false) MultipartFile imagem
    ) throws IOException {

        News noticia = noticiaService.salvar(titulo, autor, dataPublicacao, descricao, conteudo, imagem);
        return ResponseEntity.status(201).body(noticia);
    }

    @GetMapping
    public ResponseEntity<List<News>> listarNoticias() {
        return ResponseEntity.ok(noticiaRepository.findAll());
    }
}
