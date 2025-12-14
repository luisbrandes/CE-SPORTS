package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "noticias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Lob
    @Column(nullable = false)
    private String conteudo;

    @Column(nullable = false)
    private String esporte;

    @Column(nullable = false)
    private Long autorId;

    @Column(nullable = false)
    private String autorNome;

    @Column(nullable = false)
    private LocalDateTime criadaEm;
}
