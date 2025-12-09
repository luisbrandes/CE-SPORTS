package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.NotificationPreferenceDTO;
import org.ce.sports.Api.dtos.NotificationPreferenceResponseDTO;
import org.ce.sports.Api.services.NotificationPreferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificationPreference {

    private final NotificationPreferenceService preferenceService;

    // GET - Obter minhas preferências
    @GetMapping("/minhas-preferencias")
    public ResponseEntity<?> getMyPreferences() {
        try {
            NotificationPreferenceResponseDTO preferences = preferenceService.getMyPreferences();
            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao obter preferências", "message", e.getMessage()));
        }
    }

    // PUT - Atualizar minhas preferências
    @PutMapping("/minhas-preferencias")
    public ResponseEntity<?> updateMyPreferences(@RequestBody NotificationPreferenceDTO dto) {
        try {
            NotificationPreferenceResponseDTO updated = preferenceService.updateMyPreferences(dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao atualizar preferências", "message", e.getMessage()));
        }
    }

    // POST - Ativar todas as notificações
    @PostMapping("/ativar-todas")
    public ResponseEntity<?> activateAllNotifications() {
        try {
            NotificationPreferenceResponseDTO updated = preferenceService.toggleAllNotifications(true);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao ativar notificações", "message", e.getMessage()));
        }
    }

    // POST - Desativar todas as notificações
    @PostMapping("/desativar-todas")
    public ResponseEntity<?> deactivateAllNotifications() {
        try {
            NotificationPreferenceResponseDTO updated = preferenceService.toggleAllNotifications(false);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro ao desativar notificações", "message", e.getMessage()));
        }
    }
}