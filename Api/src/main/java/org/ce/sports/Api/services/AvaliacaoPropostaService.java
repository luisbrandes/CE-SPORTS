package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.AvaliacaoRequest;
import org.ce.sports.Api.entities.AvaliacaoProposta;
import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.AvaliacaoPropostaRepository;
import org.ce.sports.Api.entities.repositories.PropostaProjetoRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AvaliacaoPropostaService {

    private final AvaliacaoPropostaRepository avaliacaoRepo;
    private final PropostaProjetoRepository propostaRepo;
    private final UserRepository userRepo;

    @Transactional
    public Double avaliar(Long propostaId, AvaliacaoRequest dto, String email) {

        User usuario = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PropostaProjeto proposta = propostaRepo.findById(propostaId)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        AvaliacaoProposta avaliacao = avaliacaoRepo
                .findByProposta_IdAndUsuario_Id(propostaId, usuario.getId())
                .orElse(
                        AvaliacaoProposta.builder()
                                .proposta(proposta)
                                .usuario(usuario)
                                .build()
                );

        avaliacao.setNota(dto.getNota());
        avaliacaoRepo.save(avaliacao);


        return avaliacaoRepo.calcularMediaPorProposta(propostaId);
    }
}
