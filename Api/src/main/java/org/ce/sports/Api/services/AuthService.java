package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Login;
import org.ce.sports.Api.dtos.Register;
import org.ce.sports.Api.dtos.UserResponse;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.enums.RoleEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ---------------------------
    // LOGIN
    // ---------------------------
    public ResponseEntity<?> login(Login req, HttpServletRequest request) {
        try {
            System.out.println("🔍 Tentando login para: " + req.getEmail());

            User user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


            if (!passwordEncoder.matches(req.getSenha(), user.getSenha())) {
                System.out.println("❌ Senha incorreta para: " + req.getEmail());
                throw new BadCredentialsException("Senha incorreta");
            }

            request.getSession(true);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of());
            SecurityContextHolder.getContext().setAuthentication(authToken);

            UserResponse dto = new UserResponse(
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : null
            );

            String redirect = (user.getRole() != null && user.getRole().name().equals("ROLE_ADMIN"))
                    ? "/admin"
                    : "/aluno";

            System.out.println("✅ Login realizado com sucesso: " + req.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Login realizado com sucesso",
                    "user", dto,
                    "redirect", redirect
            ));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciais inválidas"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno no login: " + ex.getMessage()));
        }
    }

    // ---------------------------
    // LOGOUT
    // ---------------------------
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            if (request.getSession(false) != null) {
                request.getSession().invalidate();
            }
            SecurityContextHolder.clearContext();
            System.out.println("👋 Logout realizado com sucesso");
            return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao deslogar: " + ex.getMessage()));
        }
    }

    // ---------------------------
    // ME
    // ---------------------------
    public ResponseEntity<?> me(HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Não autenticado"));
            }

            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            UserResponse dto = new UserResponse(
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : null
            );

            return ResponseEntity.ok(Map.of(
                    "user", dto,
                    "sessionId", request.getSession(false) != null ? request.getSession(false).getId() : null
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao obter informações do usuário: " + ex.getMessage()));
        }
    }

    // ---------------------------
    // REGISTER
    // ---------------------------
    public ResponseEntity<?> register(Register request) {
        try {
            Optional<User> existente = userRepository.findByEmail(request.getEmail());

            if (existente.isPresent()) {
                System.out.println("⚠️ Tentativa de registro com e-mail já existente: " + request.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "E-mail já cadastrado."));
            }

            RoleEnum role = request.getRoleEnum();

            User novo = User.builder()
                    .nome(request.getNome())
                    .email(request.getEmail())
                    .senha(passwordEncoder.encode(request.getSenha()))
                    .role(role)
                    .build();

            userRepository.save(novo);
            System.out.println("✅ Usuário registrado com sucesso: " + request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuário registrado com sucesso!"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao registrar: " + e.getMessage()));
        }
    }
}
