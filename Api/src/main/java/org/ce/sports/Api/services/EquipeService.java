package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.enums.ModalidadeEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final UserRepository userRepository;
    private final CampeonatoRepository campeonatoRepository;

    public List<Equipe> listarTodasEquipes() {
        return equipeRepository.findAll();
    }

    public Optional<Equipe> buscarPorId(Long id) {
        return equipeRepository.findById(id);
    }

    public Optional<Equipe> buscarPorNome(String nome) {
        return equipeRepository.findByNome(nome);
    }

    public List<Equipe> buscarPorModalidade(ModalidadeEnum modalidade) {
        return equipeRepository.findByModalidade(modalidade);
    }

    @Transactional
    public Equipe criarEquipe(String nome, ModalidadeEnum modalidade, String descricao) {
        if (equipeRepository.findByNome(nome).isPresent()) {
            throw new RuntimeException("Já existe uma equipe com este nome");
        }

        Equipe equipe = new Equipe(nome, modalidade, descricao);
        return equipeRepository.save(equipe);
    }

    @Transactional
    public Equipe atualizarEquipe(Long id, String nome, ModalidadeEnum modalidade,
            String descricao, Boolean ativo) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        if (nome != null && !nome.isBlank()) {
            if (!equipe.getNome().equals(nome) &&
                    equipeRepository.findByNome(nome).isPresent()) {
                throw new RuntimeException("Já existe uma equipe com este nome");
            }
            equipe.setNome(nome);
        }

        if (modalidade != null) {
            equipe.setModalidade(modalidade);
        }

        if (descricao != null) {
            equipe.setDescricao(descricao);
        }

        if (ativo != null) {
            equipe.setAtivo(ativo);
        }

        return equipeRepository.save(equipe);
    }

    @Transactional
    public void deletarEquipe(Long id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        for (Campeonato campeonato : equipe.getCampeonatos()) {
            campeonato.getEquipes().remove(equipe);
            campeonatoRepository.save(campeonato);
        }

        equipeRepository.delete(equipe);
    }

    @Transactional
    public Equipe adicionarIntegrante(Long equipeId, Long alunoId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        User aluno = userRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        equipe.adicionarIntegrante(aluno);
        return equipeRepository.save(equipe);
    }

    @Transactional
    public Equipe removerIntegrante(Long equipeId, Long alunoId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        User aluno = userRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        equipe.removerIntegrante(aluno);
        return equipeRepository.save(equipe);
    }

    @Transactional
    public void inscreverEmCampeonato(Long equipeId, Long campeonatoId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        Campeonato campeonato = campeonatoRepository.findById(campeonatoId)
                .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));

        if (equipe.getCampeonatos().contains(campeonato)) {
            throw new RuntimeException("Equipe já está inscrita neste campeonato");
        }

        equipe.adicionarCampeonato(campeonato);
        campeonato.getEquipes().add(equipe);

        equipeRepository.save(equipe);
        campeonatoRepository.save(campeonato);
    }
}