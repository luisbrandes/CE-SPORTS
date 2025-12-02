package org.ce.sports.Api.entities.repositories;

import org.ce.sports.Api.entities.Treino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public interface TreinoRepository extends JpaRepository<Treino, Long> {

    Optional<Treino> findByDataAndHoraInicioAndHoraFim(
            LocalDate data,
            LocalTime horaInicio,
            LocalTime horaFim
    );
}
