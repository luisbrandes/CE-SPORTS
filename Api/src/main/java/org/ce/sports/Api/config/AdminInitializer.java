package org.ce.sports.Api.config;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.RoleEnum;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "luishfbrandes@gmail.com";

        if (userRepository.findByEmail(email).isEmpty()) {
            User admin = User.builder()
                    .nome("Administrador do Sistema")
                    .email(email)
                    .senha(passwordEncoder.encode("ces-123"))
                    .role(RoleEnum.ROLE_ADMIN)
                    .verified(true)
                    .systemAdmin(true)
                    .receberNotificacoes(true)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Usuário admin padrão criado: " + email + " / senha: ces-123");
        } else {
            System.out.println("ℹ️ Admin padrão já existe, não foi recriado.");
        }
    }
}
