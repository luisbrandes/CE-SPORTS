package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "avaliacoes_proposta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvaliacaoProposta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "proposta_id", nullable = false)
    private PropostaProjeto proposta;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private Integer nota;
}
