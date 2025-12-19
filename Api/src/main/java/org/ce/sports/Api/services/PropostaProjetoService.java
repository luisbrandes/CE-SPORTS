package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.PropostaProjetoDTO;
import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.StatusProposta;
import org.ce.sports.Api.entities.repositories.PropostaProjetoRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropostaProjetoService {

    private final PropostaProjetoRepository repository;
    private final UserRepository userRepository;

    // ---------------------- CRIAR PROPOSTA ----------------------
    @Transactional
    public PropostaProjeto criar(PropostaProjetoDTO dto, String email) {

        User aluno = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PropostaProjeto proposta = PropostaProjeto.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .modalidade(dto.getModalidade())
                .local(dto.getLocal())
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .aluno(aluno)
                .status(StatusProposta.PENDENTE)
                .dataCriacao(LocalDate.now())
                .build();

        return repository.save(proposta);
    }

    // ---------------------- LISTAR MINHAS PROPOSTAS ----------------------
    @Transactional(readOnly = true)
    public List<PropostaProjeto> listarMinhas(String email) {

        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return repository.findByAlunoEmail(email);
    }

    // ---------------------- LISTAR TODAS (ADMIN) ----------------------
    @Transactional(readOnly = true)
    public List<PropostaProjeto> listarTodas() {
        return repository.findAll();
    }

    // ---------------------- ATUALIZAR PROPOSTA ----------------------
    @Transactional
    public PropostaProjeto atualizar(Long id, PropostaProjetoDTO dto, String email) {

        PropostaProjeto proposta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        if (!proposta.getAluno().getEmail().equals(email)) {
            throw new RuntimeException("Você não tem permissão para editar esta proposta");
        }

        if (proposta.getStatus() != StatusProposta.PENDENTE) {
            throw new RuntimeException("Proposta já foi avaliada");
        }

        if (dto.getNome() != null) proposta.setNome(dto.getNome());
        if (dto.getDescricao() != null) proposta.setDescricao(dto.getDescricao());
        if (dto.getModalidade() != null) proposta.setModalidade(dto.getModalidade());
        if (dto.getLocal() != null) proposta.setLocal(dto.getLocal());
        if (dto.getDataInicio() != null) proposta.setDataInicio(dto.getDataInicio());
        if (dto.getDataFim() != null) proposta.setDataFim(dto.getDataFim());

        return repository.save(proposta);
    }

    @Transactional
    public void excluir(Long id, String email) {
        PropostaProjeto proposta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        if (!proposta.getAluno().getEmail().equals(email))
            throw new RuntimeException("Sem permissão");

        if (proposta.getStatus() != StatusProposta.PENDENTE)
            throw new RuntimeException("Proposta já avaliada");

        repository.delete(proposta);
    }

}