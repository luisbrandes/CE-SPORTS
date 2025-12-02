package org.ce.sports.Api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ce.sports.Api.entities.Treino;
import org.ce.sports.Api.entities.repositories.TreinoRepository;
import org.ce.sports.Api.dtos.TreinoDTO;
import org.ce.sports.Api.dtos.TreinoRecorrenteDTO;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.*;

@Service
public class TreinoService {

    @Autowired
    private TreinoRepository treinoRepository;

    public List<Treino> listarTreinos() {
        List<Treino> treinos = treinoRepository.findAll();

        for (Treino t : treinos) {
            if (t.isRecorrente()) {
                t.setTodasDatas(gerarDatasRecorrentes(t));
            } else {
                t.setTodasDatas(List.of(t.getData()));
            }
        }

        return treinos;
    }

    // 🔹 Gera todas as datas com base no período do treino
    private List<LocalDate> gerarDatasRecorrentes(Treino t) {

        List<LocalDate> datas = new ArrayList<>();
        LocalDate atual = t.getDataInicio();

        Set<DayOfWeek> dias = new HashSet<>();
        for (String dia : t.getDiasDaSemana()) {
            dias.add(DayOfWeek.valueOf(dia));
        }

        while (!atual.isAfter(t.getDataFim())) {

            if (dias.contains(atual.getDayOfWeek())) {
                datas.add(atual);
            }

            atual = atual.plusDays(1);
        }

        return datas;
    }

    // 🔹 Treino único
    public Treino criarTreino(TreinoDTO dto) {

        if (dto.getData() == null)
            throw new RuntimeException("Data inválida");

        Treino t = new Treino();
        t.setModalidade(dto.getModalidade());
        t.setHoraInicio(dto.getHoraInicio());
        t.setHoraFim(dto.getHoraFim());
        t.setLocal(dto.getLocal());
        t.setProfessor(dto.getProfessor());
        t.setVagasTotais(dto.getVagasTotais());

        t.setRecorrente(false);
        t.setData(dto.getData());

        return treinoRepository.save(t);
    }

    // 🔹 Treino recorrente
    public Treino criarTreinosRecorrentes(TreinoRecorrenteDTO dto) {

        if (dto.getDataInicio() == null || dto.getDataFim() == null)
            throw new RuntimeException("Período inválido");

        if (dto.getDiasDaSemana() == null || dto.getDiasDaSemana().isEmpty())
            throw new RuntimeException("Selecione ao menos um dia");

        Treino treino = new Treino();
        treino.setModalidade(dto.getModalidade());
        treino.setHoraInicio(dto.getHoraInicio());
        treino.setHoraFim(dto.getHoraFim());
        treino.setLocal(dto.getLocal());
        treino.setProfessor(dto.getProfessor());
        treino.setVagasTotais(dto.getVagasTotais());

        treino.setRecorrente(true);
        treino.setDataInicio(dto.getDataInicio());
        treino.setDataFim(dto.getDataFim());
        treino.setDiasDaSemana(
                dto.getDiasDaSemana().stream()
                        .map(Enum::name)
                        .toList()
        );

        return treinoRepository.save(treino);
    }
}
