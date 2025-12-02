package org.ce.sports.Api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ce.sports.Api.entities.Treino;
import org.ce.sports.Api.entities.repositories.TreinoRepository;
import org.ce.sports.Api.dtos.TreinoDTO;
import org.ce.sports.Api.dtos.TreinoRecorrenteDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TreinoService {

    @Autowired
    private TreinoRepository treinoRepository;

    public List<Treino> listarTreinos() {
        return treinoRepository.findAll();
    }

    public Treino criarTreino(TreinoDTO dto) {
        return criarTreinoInterno(dto, true);
    }

    private Treino criarTreinoInterno(TreinoDTO dto, boolean validarConflito) {

        validarDados(dto);

        if (validarConflito) {
            validarConflito(dto);
        }

        Treino treino = criarInstanciaTreino(dto);
        return salvarTreino(treino);
    }

    private void validarDados(TreinoDTO dto) {
        if (dto.getData() == null || dto.getData().isBefore(LocalDate.now())) {
            throw new RuntimeException("Data inválida");
        }
        if (dto.getVagasTotais() == null || dto.getVagasTotais() <= 0) {
            throw new RuntimeException("Vagas devem ser maiores que zero");
        }
    }

    private void validarConflito(TreinoDTO dto) {
        Optional<Treino> existente =
                treinoRepository.findByDataAndHoraInicioAndHoraFim(
                        dto.getData(),
                        dto.getHoraInicio(),
                        dto.getHoraFim()
                );

        if (existente.isPresent()) {
            throw new RuntimeException("Já existe um treino nesse horário e data");
        }
    }

    private Treino criarInstanciaTreino(TreinoDTO dto) {
        Treino treino = new Treino();
        treino.setModalidade(dto.getModalidade());
        treino.setData(dto.getData());
        treino.setHoraInicio(dto.getHoraInicio());
        treino.setHoraFim(dto.getHoraFim());
        treino.setLocal(dto.getLocal());
        treino.setProfessor(dto.getProfessor());
        treino.setVagasTotais(dto.getVagasTotais());
        treino.setStatus("ATIVO");
        return treino;
    }

    private Treino salvarTreino(Treino treino) {
        return treinoRepository.save(treino);
    }

    public void criarTreinosRecorrentes(TreinoRecorrenteDTO dto) {

        if (dto.getDataInicio() == null || dto.getDataFim() == null) {
            throw new RuntimeException("Datas inválidas");
        }

        if (dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new RuntimeException("Data final não pode ser antes da inicial");
        }

        if (dto.getDiasDaSemana() == null || dto.getDiasDaSemana().isEmpty()) {
            throw new RuntimeException("Selecione ao menos um dia da semana");
        }

        LocalDate data = dto.getDataInicio();

        while (!data.isAfter(dto.getDataFim())) {

            if (dto.getDiasDaSemana().contains(data.getDayOfWeek())) {

                TreinoDTO treino = new TreinoDTO();
                treino.setModalidade(dto.getModalidade());
                treino.setData(data);
                treino.setHoraInicio(dto.getHoraInicio());
                treino.setHoraFim(dto.getHoraFim());
                treino.setLocal(dto.getLocal());
                treino.setProfessor(dto.getProfessor());
                treino.setVagasTotais(dto.getVagasTotais());

                criarTreinoInterno(treino, false);
            }

            data = data.plusDays(1);
        }
    }
}
