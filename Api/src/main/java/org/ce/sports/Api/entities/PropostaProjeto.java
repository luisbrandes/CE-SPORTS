package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ce.sports.Api.enums.StatusProposta;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "propostas_projetos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropostaProjeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(length = 1000)
    private String descricao;

    private String modalidade;
    private String local;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    private StatusProposta status;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private User aluno;

    private LocalDate dataCriacao;

    @OneToMany(mappedBy = "proposta", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AvaliacaoProposta> avaliacoes = new HashSet<>();

    public double getMediaAvaliacoes() {
        if (avaliacoes.isEmpty()) return 0.0;

        return avaliacoes.stream()
                .mapToInt(AvaliacaoProposta::getNota)
                .average()
                .orElse(0.0);
    }

}