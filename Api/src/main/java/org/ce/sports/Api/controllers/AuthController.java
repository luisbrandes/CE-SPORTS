package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Register;
import org.ce.sports.Api.dtos.Login;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login req, HttpServletRequest request) {
        return authService.login(req, request);
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return authService.logout(request);
    }

    // ME
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        return authService.me(request);
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Register request) {
        return authService.register(request);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String codigo = req.get("codigo");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Conta já verificada."));
        }

        if (!user.getVerificationCode().equals(codigo)) {
            return ResponseEntity.status(401).body(Map.of("error", "Código inválido."));
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Conta verificada com sucesso!"));
    }
}
