package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Login;
import org.ce.sports.Api.dtos.Register;
import org.ce.sports.Api.enums.RoleEnum;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.ce.sports.Api.entities.User;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<Void> login(Login request) {
        Optional<User> usuarioOpt = userRepository.findByEmail(request.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = usuarioOpt.get();
        boolean senhaValida = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!senhaValida) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Void> register(Register request) {
        Optional<User> existente = userRepository.findByEmail(request.getEmail());

        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User novo = User.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .role(RoleEnum.ROLE_USER)
                .build();

        userRepository.save(novo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}