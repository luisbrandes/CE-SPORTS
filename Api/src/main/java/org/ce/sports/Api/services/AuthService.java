package org.ce.sports.Api.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ---------------------------
    // LOGIN
    // ---------------------------
    public ResponseEntity<?> login(Login req, HttpServletRequest request) {
        try {
            System.out.println("🔍 Tentando login para: " + req.getEmail());

            User user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if (!passwordEncoder.matches(req.getSenha(), user.getSenha())) {
                throw new BadCredentialsException("Senha incorreta");
            }

            if (user.getRole() == RoleEnum.ROLE_USER && !user.isVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Conta ainda não verificada. Verifique seu e-mail."));
            }

            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Aguarde aprovação de um administrador."));
            }

            HttpSession session = request.getSession(true);
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    List.of(new SimpleGrantedAuthority(user.getRole().name()))
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authToken);
            session.setAttribute("SPRING_SECURITY_CONTEXT", context);
            SecurityContextHolder.setContext(context);

            UserResponse dto = new UserResponse(
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getRole().name()
            );

            String redirect = user.getRole() == RoleEnum.ROLE_ADMIN ? "/admin" : "/";

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
            HttpSession session = request.getSession(false);
            if (session != null) session.invalidate();
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
            HttpSession session = request.getSession(false);
            if (session == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Sem sessão ativa"));

            SecurityContext context = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
            if (context == null || context.getAuthentication() == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Não autenticado"));

            Authentication auth = context.getAuthentication();
            String email = auth.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            UserResponse dto = new UserResponse(
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(Map.of(
                    "user", dto,
                    "sessionId", session.getId()
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
    // ---------------------------
// REGISTER
// ---------------------------
    public ResponseEntity<?> register(Register request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "E-mail já cadastrado."));
            }

            if (request.getRoleEnum() == RoleEnum.ROLE_USER) {
                String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);

                User novo = User.builder()
                        .nome(request.getNome())
                        .email(request.getEmail())
                        .senha(passwordEncoder.encode(request.getSenha()))
                        .role(RoleEnum.ROLE_USER)
                        .verified(false)
                        .systemAdmin(false)
                        .receberNotificacoes(true) // ✅ CORREÇÃO
                        .verificationCode(codigo)
                        .build();

                userRepository.save(novo);
                emailService.enviarCodigoVerificacao(request.getEmail(), codigo);

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of(
                                "message", "Usuário registrado! Código enviado para o e-mail.",
                                "email", request.getEmail()
                        ));
            }

            if (request.getRoleEnum() == RoleEnum.ROLE_ADMIN) {
                User novoAdmin = User.builder()
                        .nome(request.getNome())
                        .email(request.getEmail())
                        .senha(passwordEncoder.encode(request.getSenha()))
                        .role(RoleEnum.ROLE_ADMIN)
                        .verified(false)
                        .systemAdmin(false)
                        .receberNotificacoes(true)
                        .verificationCode(null)
                        .build();

                userRepository.save(novoAdmin);

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of(
                                "message", "Administrador registrado! Aguarde aprovação de outro administrador."
                        ));
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Tipo de usuário inválido."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao registrar: " + e.getMessage()));
        }
    }


    // ---------------------------
    // VERIFY
    // ---------------------------
    public ResponseEntity<?> verify(Map<String, String> req) {
        try {
            String email = req.get("email");
            String codigo = req.get("codigo");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if (user.getRole() != RoleEnum.ROLE_USER) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Somente usuários comuns precisam verificar o e-mail."));
            }

            if (user.isVerified()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Conta já verificada."));
            }

            if (!codigo.equals(user.getVerificationCode())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Código inválido."));
            }

            user.setVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Conta verificada com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao verificar conta: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> forgotPassword(Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email não encontrado");
        }

        User user = userOpt.get();

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpiration(LocalDateTime.now().plusHours(1));

        userRepository.save(user);

        emailService.sendResetPasswordEmail(
                user.getEmail(),
                "http://localhost:3000/reset-password?token=" + token
        );

        return ResponseEntity.ok("Email enviado");
    }

    public ResponseEntity<?> resetPassword(Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
        }

        User user = userOpt.get();

        if (user.getTokenExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expirado");
        }

        user.setSenha(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiration(null);

        userRepository.save(user);

        return ResponseEntity.ok("Senha atualizada");
    }
}
