package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Register;
import org.ce.sports.Api.dtos.UserSimpleResponse;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.enums.RoleEnum;
import org.ce.sports.Api.dtos.Login;
import org.ce.sports.Api.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000" }, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login req, HttpServletRequest request) {
        return authService.login(req, request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return authService.logout(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        return authService.me(request);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Register request) {
        return authService.register(request);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {
        return authService.verify(req);
    }

    @GetMapping("/alunos")
    public ResponseEntity<List<UserSimpleResponse>> getAlunos() {
        List<User> alunos = userRepository.findByRole(RoleEnum.ROLE_USER);

        List<UserSimpleResponse> response = alunos.stream()
                .map(user -> new UserSimpleResponse(
                        user.getId(),
                        user.getNome(),
                        user.getEmail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UserSimpleResponse>> getUsuariosPorRole(
            @RequestParam(required = false) String role) {

        List<User> usuarios;

        if (role != null && !role.isBlank()) {
            try {
                RoleEnum roleEnum = RoleEnum.valueOf(role.toUpperCase());
                usuarios = userRepository.findByRole(roleEnum);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            usuarios = userRepository.findAll();
        }

        List<UserSimpleResponse> response = usuarios.stream()
                .map(user -> new UserSimpleResponse(
                        user.getId(),
                        user.getNome(),
                        user.getEmail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    } // 👈 FECHAMENTO QUE FALTAVA

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        return authService.forgotPassword(req);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        return authService.resetPassword(req);
    }
}
