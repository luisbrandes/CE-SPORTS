package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.ce.sports.Api.services.NotificationPreferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceService service;
    private final UserRepository userRepository;

    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null)
            throw new RuntimeException("Usuário não autenticado");

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return user.getId();
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> status() {
        Long userId = getUserId();
        return ResponseEntity.ok(service.getPreference(userId));
    }

    @PostMapping("/ativar")
    public ResponseEntity<String> ativar() {
        Long userId = getUserId();
        service.updatePreference(userId, true);
        return ResponseEntity.ok("Notificações ativadas");
    }

    @PostMapping("/desativar")
    public ResponseEntity<String> desativar() {
        Long userId = getUserId();
        service.updatePreference(userId, false);
        return ResponseEntity.ok("Notificações desativadas");
    }
}
