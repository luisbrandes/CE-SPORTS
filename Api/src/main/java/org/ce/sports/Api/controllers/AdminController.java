package org.ce.sports.Api.controllers;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.services.AdminApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminApprovalService adminApprovalService;

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
}
