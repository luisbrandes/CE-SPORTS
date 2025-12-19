package org.ce.sports.Api.dtos;

import lombok.Data;

@Data
public class NewsUpdateDTO {
    private String titulo;
    private String conteudo;
    private String esporte;
    private String autorNome;
    private String criadaEm;
}