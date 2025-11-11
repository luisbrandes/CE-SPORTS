package org.ce.sports.Api.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.ce.sports.Api.enums.RoleEnum;

/**
 * Representa os dados enviados na requisição de cadastro de usuário.
 */
@Getter
@Setter
public class Register {

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O e-mail informado é inválido.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;


    @NotBlank(message = "O papel (role) é obrigatório.")
    private String role;


    public RoleEnum getRoleEnum() {
        if (role == null) {
            return RoleEnum.ROLE_USER;
        }

        switch (role.toLowerCase()) {
            case "admin":
                return RoleEnum.ROLE_ADMIN;
            case "aluno":
            default:
                return RoleEnum.ROLE_USER;
        }
    }
}
