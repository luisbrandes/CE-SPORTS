package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.ProjetoEsportivoDTO;
import org.ce.sports.Api.dtos.ProjetoUpdateDTO;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.ProjetoEsportivoRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjetoEsportivoService {

    private final ProjetoEsportivoRepository repository;
    private final UserRepository userRepository;

    // ---------------------- CRIAR ----------------------
    public ProjetoEsportivo criarProjeto(ProjetoEsportivoDTO dto) {

        ProjetoEsportivo projeto = ProjetoEsportivo.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .local(dto.getLocal())
                .modalidade(dto.getModalidade())
                .responsavel(dto.getResponsavel())
                .vagasTotais(dto.getVagasTotais() != null ? dto.getVagasTotais() : 0)
                .vagasPreenchidas(0)
                .build();

        return repository.save(projeto);
    }

    // ---------------------- LISTAR ----------------------
    public List<ProjetoEsportivo> listarProjetos() {
        return repository.findAll();
    }

    // ---------------------- DELETAR ----------------------
    public void deletarProjeto(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Projeto não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    // ---------------------- INSCREVER ----------------------
    @Transactional
    public ProjetoEsportivo inscreverAluno(Long projetoId, String userEmail) {

        ProjetoEsportivo projeto = repository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        User aluno = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (projeto.getInscritos().contains(aluno)) {
            throw new RuntimeException("Você já está inscrito neste projeto");
        }

        if (projeto.getVagasPreenchidas() >= projeto.getVagasTotais()) {
            throw new RuntimeException("Não há vagas disponíveis");
        }

        projeto.getInscritos().add(aluno);
        projeto.setVagasPreenchidas(projeto.getVagasPreenchidas() + 1);

        return repository.save(projeto);
    }

    // ---------------------- CANCELAR INSCRIÇÃO ----------------------
    @Transactional
    public ProjetoEsportivo cancelarInscricao(Long projetoId, String userEmail) {

        ProjetoEsportivo projeto = repository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        User aluno = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!projeto.getInscritos().contains(aluno)) {
            throw new RuntimeException("Você não está inscrito neste projeto");
        }

        projeto.getInscritos().remove(aluno);
        projeto.setVagasPreenchidas(projeto.getVagasPreenchidas() - 1);

        return repository.save(projeto);
    }

    // ---------------------- LISTAR INSCRITOS DO USUÁRIO ----------------------
    public List<Long> listarProjetosInscritos(String userEmail) {

        User aluno = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return repository.findAll().stream()
                .filter(p -> p.getInscritos().contains(aluno))
                .map(ProjetoEsportivo::getId)
                .collect(Collectors.toList());
    }

    // ---------------------- ATUALIZAR (PATCH) ----------------------
    public ProjetoEsportivo atualizarProjeto(Long id, ProjetoUpdateDTO dto) {

        ProjetoEsportivo projeto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (dto.getNome() != null) projeto.setNome(dto.getNome());
        if (dto.getDescricao() != null) projeto.setDescricao(dto.getDescricao());
        if (dto.getModalidade() != null) projeto.setModalidade(dto.getModalidade());
        if (dto.getLocal() != null) projeto.setLocal(dto.getLocal());
        if (dto.getResponsavel() != null) projeto.setResponsavel(dto.getResponsavel());

        if (dto.getDataInicio() != null) projeto.setDataInicio(dto.getDataInicio());
        if (dto.getDataFim() != null) projeto.setDataFim(dto.getDataFim());

        if (dto.getVagasTotais() != null) projeto.setVagasTotais(dto.getVagasTotais());

        return repository.save(projeto);
    }

}
