package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.NewsCreateDTO;
import org.ce.sports.Api.dtos.NewsUpdateDTO;
import org.ce.sports.Api.entities.News;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.NewsRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository repository;
    private final UserRepository userRepository;

    // ----------------------------------------------------
    //                  CRIAR NOTÍCIA
    // ----------------------------------------------------
    public News criar(NewsCreateDTO dto) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User autor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        News news = News.builder()
                .titulo(dto.getTitulo())
                .conteudo(dto.getConteudo())
                .esporte(dto.getEsporte())
                .autorId(autor.getId())
                .autorNome(autor.getNome())
                .criadaEm(LocalDateTime.now())
                .build();

        return repository.save(news);
    }

    // ----------------------------------------------------
    //                 ATUALIZAR (PUT)
    // ----------------------------------------------------
    public News atualizar(Long id, NewsUpdateDTO dto) {

        News noticia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notícia não encontrada"));

        noticia.setTitulo(dto.getTitulo());
        noticia.setConteudo(dto.getConteudo());
        noticia.setEsporte(dto.getEsporte());

        return repository.save(noticia);
    }

    // ----------------------------------------------------
    //                 ATUALIZAR (PATCH)
    // ----------------------------------------------------
    public News atualizarParcial(Long id, NewsUpdateDTO dto) {

        News noticia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notícia não encontrada"));

        if (dto.getTitulo() != null)
            noticia.setTitulo(dto.getTitulo());

        if (dto.getConteudo() != null)
            noticia.setConteudo(dto.getConteudo());

        if (dto.getEsporte() != null)
            noticia.setEsporte(dto.getEsporte());


        return repository.save(noticia);
    }

    // ----------------------------------------------------
    //                        DELETE
    // ----------------------------------------------------
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Notícia não encontrada");
        }
        repository.deleteById(id);
    }
}
