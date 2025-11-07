package org.ce.sports.Api.services;

import org.ce.sports.Api.entities.News;
import org.ce.sports.Api.entities.repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;

@Service
public class NewsService {

    private final NewsRepository noticiaRepository;

    public NewsService(NewsRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }

    public News salvar(String titulo,
                       String autor,
                       String esporte,
                       String conteudo) throws IOException {

        News noticia = News.builder()
                .titulo(titulo)
                .autorNome(autor)
                .esporte(esporte)
                .autorId(noticiaRepository.findByAutorNome(autor).getAutorId())
                .conteudo(conteudo)
                .criadaEm(LocalDateTime.now())
                .build();

        return noticiaRepository.save(noticia);
    }
}
