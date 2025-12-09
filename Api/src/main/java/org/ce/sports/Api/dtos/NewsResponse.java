package org.ce.sports.Api.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NewsResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private String esporte;
    private Long autorId;
    private String autorNome;
    private LocalDateTime criadaEm;
}
