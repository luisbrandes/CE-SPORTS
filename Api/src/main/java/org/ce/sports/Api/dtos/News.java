package org.ce.sports.Api.dtos;

import org.springframework.web.bind.annotation.RequestBody;

public record News(String titulo,
                   String autor,
                   String dataPublicacao,
                   String esporte,
                   String conteudo) {
}
