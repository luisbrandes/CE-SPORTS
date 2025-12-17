package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.Equipe;
import org.ce.sports.Api.entities.Partida;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.repositories.EquipeRepository;
import org.ce.sports.Api.entities.repositories.PartidaRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.entities.repositories.CampeonatoRepository;
import org.ce.sports.Api.enums.ModalidadeEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final UserRepository userRepository;
    private final CampeonatoRepository campeonatoRepository;
    private final PartidaRepository partidaRepository;

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
    public boolean excluirEquipeComRelacionamentos(Long equipeId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        try {
            System.out.println("Iniciando exclusão da equipe: " + equipe.getNome() + " (ID: " + equipeId + ")");

            desvincularPartidas(equipeId);

            removerDeCampeonatos(equipe);

            removerVinculosUsuarios(equipe);

            equipeRepository.delete(equipe);

            System.out.println("Equipe excluída com sucesso!");
            return true;

        } catch (Exception e) {
            System.err.println("Erro ao excluir equipe " + equipe.getNome() + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Não foi possível excluir a equipe: " + e.getMessage(), e);
        }
    }

    private void desvincularPartidas(Long equipeId) {
        System.out.println("Desvinculando partidas da equipe ID: " + equipeId);

        List<Partida> partidas = partidaRepository.findByEquipeParticipanteId(equipeId);
        System.out.println("Encontradas " + partidas.size() + " partidas para desvincular");

        for (Partida partida : partidas) {
            System.out.println("Processando partida ID: " + partida.getId());

            if (partida.getEquipe1() != null && partida.getEquipe1().getId().equals(equipeId)) {
                System.out.println(" - Desvinculando equipe1");
                partida.setEquipe1(null);
            }

            if (partida.getEquipe2() != null && partida.getEquipe2().getId().equals(equipeId)) {
                System.out.println(" - Desvinculando equipe2");
                partida.setEquipe2(null);
            }

            if (partida.getVencedor() != null && partida.getVencedor().getId().equals(equipeId)) {
                System.out.println(" - Desvinculando vencedor");
                partida.setVencedor(null);

                if (partida.getPontuacao1() == partida.getPontuacao2()) {
                    partida.setEmpate(true);
                }
            }

            partidaRepository.save(partida);
        }

        System.out.println("Partidas desvinculadas com sucesso!");
    }

    private void removerDeCampeonatos(Equipe equipe) {
        System.out.println("Removendo equipe dos campeonatos");

        List<Campeonato> campeonatos = new ArrayList<>(equipe.getCampeonatos());

        for (Campeonato campeonato : campeonatos) {
            System.out.println(" - Removendo do campeonato: " + campeonato.getNome());

            campeonato.getEquipes().remove(equipe);
            campeonatoRepository.save(campeonato);

            equipe.getCampeonatos().remove(campeonato);
        }

        System.out.println("Equipe removida de " + campeonatos.size() + " campeonatos");
    }

    private void removerVinculosUsuarios(Equipe equipe) {
        System.out.println("Removendo vínculos com usuários");

        List<User> usuarios = new ArrayList<>(equipe.getIntegrantes());

        for (User usuario : usuarios) {
            System.out.println(" - Removendo vínculo com usuário: " + usuario.getNome());

            usuario.getEquipes().remove(equipe);
            userRepository.save(usuario);

            equipe.getIntegrantes().remove(usuario);
        }

        System.out.println("Vínculos removidos de " + usuarios.size() + " usuários");
    }

    public boolean podeExcluirEquipe(Long equipeId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        List<Partida> partidas = partidaRepository.findByEquipeParticipanteId(equipeId);

        System.out.println("Verificando exclusão da equipe: " + equipe.getNome());
        System.out.println(" - Campeonatos: " + equipe.getCampeonatos().size());
        System.out.println(" - Integrantes: " + equipe.getIntegrantes().size());
        System.out.println(" - Partidas: " + partidas.size());

        return true;
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