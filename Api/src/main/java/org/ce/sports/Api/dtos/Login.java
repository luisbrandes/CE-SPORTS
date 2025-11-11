package org.ce.sports.Api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login {

    @NotBlank(message = "O campo 'email' é obrigatório.")
    private String email;

    @NotBlank(message = "O campo 'password' é obrigatório.")
    private String senha;
}