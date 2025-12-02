package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Notification;
import org.ce.sports.Api.services.AdminApprovalService;
import org.ce.sports.Api.services.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminApprovalService adminApprovalService;
    private final EmailService emailService;
    @GetMapping("/pending-admins")
    public ResponseEntity<?> listarPendentes() {
        return adminApprovalService.listarPendentes();
    }

    @PostMapping("/approve-admin/{id}")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        return adminApprovalService.aprovarAdmin(id);
    }

    @DeleteMapping("/reject-admin/{id}")
    public ResponseEntity<?> rejeitar(@PathVariable Long id) {
        return adminApprovalService.rejeitarAdmin(id);
    }

    @PostMapping("/notification/send")
    public ResponseEntity<?> sendNotification(@RequestBody Notification notification) {
        emailService.enviarNotificacao(notification.titulo(), notification.mensagem());
        return ResponseEntity.ok().build();
    }
}
