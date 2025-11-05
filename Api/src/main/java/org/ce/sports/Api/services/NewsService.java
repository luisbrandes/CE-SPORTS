package org.ce.sports.Api.services;

import org.ce.sports.Api.entities.News;
import org.ce.sports.Api.entities.repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class NewsService {

    private final NewsRepository noticiaRepository;

    @Value("${uploads.dir}")
    private String uploadDir;

    public NewsService(NewsRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }

    public News salvar(String titulo,
                       String autor,
                       String dataPublicacao,
                       String descricao,
                       String conteudo,
                       MultipartFile imagem) throws IOException {

        String imagemUrl = null;

        if (imagem != null && !imagem.isEmpty()) {
            Path dir = Paths.get(uploadDir);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            String nomeArquivo = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
            Path caminho = dir.resolve(nomeArquivo);
            Files.copy(imagem.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);
            imagemUrl = "/uploads/" + nomeArquivo;
        }

        News noticia = News.builder()
                .titulo(titulo)
                .autor(autor)
                .dataPublicacao(LocalDate.parse(dataPublicacao))
                .descricao(descricao)
                .conteudo(conteudo)
                .imagemUrl(imagemUrl)
                .criadaEm(LocalDateTime.now())
                .build();

        return noticiaRepository.save(noticia);
    }
}
