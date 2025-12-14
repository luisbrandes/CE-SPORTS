package org.ce.sports.Api.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsCreateDTO {
    private String titulo;
    private String conteudo;
    private String esporte;

}
