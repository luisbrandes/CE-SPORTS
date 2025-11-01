package org.ce.sports.Api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login {

    @NotBlank(message = "O campo 'username' é obrigatório.")
    private String username;

    @NotBlank(message = "O campo 'password' é obrigatório.")
    private String password;
}