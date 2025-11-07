package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.UserResponse;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.services.AuthService;
import org.ce.sports.Api.dtos.Register;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

/**
 * AuthController padronizado para respostas JSON.
 * Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 * - POST /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AuthService authService;

    public static class LoginRequest {
        public String email;
        public String senha;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            UsernamePasswordAuthenticationToken authReq =
                    new UsernamePasswordAuthenticationToken(req.email, req.senha);
            Authentication auth = authenticationManager.authenticate(authReq);

            SecurityContextHolder.getContext().setAuthentication(auth);
            request.getSession(true); // cria sessão e envia JSESSIONID

            Object principal = auth.getPrincipal();
            User user;
            if (principal instanceof User) {
                user = (User) principal;
            } else {
                Optional<User> u = userRepository.findByEmail(req.email);
                if (u.isEmpty()) {
                    return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado"));
                }
                user = u.get();
            }

            UserResponse dto = new UserResponse(
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : null
            );

            return ResponseEntity.ok(dto);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas"));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao autenticar: " + ex.getMessage()));
        }
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            if (request.getSession(false) != null) {
                request.getSession().invalidate();
            }
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao deslogar: " + ex.getMessage()));
        }
    }

    // ME
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Não autenticado"));
        }

        Object principal = auth.getPrincipal();
        User user;
        if (principal instanceof User) {
            user = (User) principal;
        } else {
            String username = auth.getName();
            Optional<User> u = userRepository.findByEmail(username);
            if (u.isEmpty()) return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado"));
            user = u.get();
        }

        UserResponse dto = new UserResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : null
        );

        return ResponseEntity.ok(dto);
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Register request) {
        try {
            var response = authService.register(request);
            if (response.getStatusCode() == HttpStatus.CONFLICT) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "E-mail já cadastrado."));
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuário registrado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao registrar: " + e.getMessage()));
        }
    }
}
