package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.PropostaProjetoDTO;
import org.ce.sports.Api.dtos.PropostaResponseDTO;
import org.ce.sports.Api.entities.ProjetoEsportivo;
import org.ce.sports.Api.entities.PropostaProjeto;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.AvaliacaoPropostaRepository;
import org.ce.sports.Api.entities.repositories.ProjetoEsportivoRepository;
import org.ce.sports.Api.entities.repositories.PropostaProjetoRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.enums.StatusProposta;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropostaProjetoService {

    private final PropostaProjetoRepository propostaRepo;
    private final ProjetoEsportivoRepository projetoRepo;
    private final UserRepository userRepo;
    private final AvaliacaoPropostaRepository avaliacaoRepo;

    // ----------- CRIAR -----------
    @Transactional
    public PropostaProjeto criar(PropostaProjetoDTO dto, String email) {

        if (dto.getVagasTotais() == null || dto.getVagasTotais() <= 0) {
            throw new IllegalArgumentException("Quantidade de vagas inválida");
        }

        User aluno = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PropostaProjeto proposta = PropostaProjeto.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .modalidade(dto.getModalidade())
                .local(dto.getLocal())
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .vagasTotais(dto.getVagasTotais())
                .aluno(aluno)
                .status(StatusProposta.PENDENTE)
                .dataCriacao(LocalDate.now())
                .build();

        return propostaRepo.save(proposta);
    }

    // ----------- LISTAR MINHAS -----------
    @Transactional(readOnly = true)
    public List<PropostaProjeto> listarMinhas(String email) {
        return propostaRepo.findByAlunoEmail(email);
    }

    // ----------- LISTAR COM AVALIAÇÕES -----------
    @Transactional(readOnly = true)
    public List<PropostaResponseDTO> listarComAvaliacoes(User usuario) {
        return propostaRepo.findAll().stream().map(proposta -> {

            Double media = avaliacaoRepo.calcularMediaPorProposta(proposta.getId());

            Integer minhaNota = avaliacaoRepo
                    .findByProposta_IdAndUsuario_Id(proposta.getId(), usuario.getId())
                    .map(a -> a.getNota())
                    .orElse(null);

            return PropostaResponseDTO.builder()
                    .id(proposta.getId())
                    .nome(proposta.getNome())
                    .descricao(proposta.getDescricao())
                    .modalidade(proposta.getModalidade())
                    .local(proposta.getLocal())
                    .alunoNome(proposta.getAluno().getNome())
                    .vagasTotais(proposta.getVagasTotais())
                    .mediaAvaliacoes(media != null ? media : 0.0)
                    .minhaNota(minhaNota)
                    .build();
        }).toList();
    }

    // ----------- ATUALIZAR -----------
    @Transactional
    public PropostaProjeto atualizar(Long id, PropostaProjetoDTO dto, String email) {

        PropostaProjeto proposta = propostaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        if (!proposta.getAluno().getEmail().equals(email))
            throw new RuntimeException("Sem permissão");

        if (proposta.getStatus() != StatusProposta.PENDENTE)
            throw new RuntimeException("Proposta já avaliada");

        proposta.setNome(dto.getNome());
        proposta.setDescricao(dto.getDescricao());
        proposta.setModalidade(dto.getModalidade());
        proposta.setLocal(dto.getLocal());
        proposta.setDataInicio(dto.getDataInicio());
        proposta.setDataFim(dto.getDataFim());
        proposta.setVagasTotais(dto.getVagasTotais());

        return propostaRepo.save(proposta);
    }

    // ----------- EXCLUIR -----------
    @Transactional
    public void excluir(Long id, String email) {

        PropostaProjeto proposta = propostaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        if (!proposta.getAluno().getEmail().equals(email))
            throw new RuntimeException("Sem permissão");

        propostaRepo.delete(proposta);
    }

    // ----------- APROVAR -----------
    @Transactional
    public void aprovar(Long id) {

        PropostaProjeto proposta = propostaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        Double media = avaliacaoRepo.calcularMediaPorProposta(id);

        if (media == null || media < 3.0)
            throw new RuntimeException("Média insuficiente para aprovação");

        ProjetoEsportivo projeto = ProjetoEsportivo.builder()
                .nome(proposta.getNome())
                .descricao(proposta.getDescricao())
                .modalidade(proposta.getModalidade())
                .local(proposta.getLocal())
                .dataInicio(proposta.getDataInicio())
                .dataFim(proposta.getDataFim())
                .responsavel(proposta.getAluno().getNome())
                .vagasTotais(proposta.getVagasTotais())
                .vagasPreenchidas(0)
                .build();

        projetoRepo.save(projeto);

        proposta.setStatus(StatusProposta.APROVADA);
        propostaRepo.save(proposta);
    }

    // ----------- REJEITAR -----------
    @Transactional
    public void rejeitar(Long id) {

        PropostaProjeto proposta = propostaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));

        proposta.setStatus(StatusProposta.REJEITADA);
        propostaRepo.save(proposta);
    }
}
