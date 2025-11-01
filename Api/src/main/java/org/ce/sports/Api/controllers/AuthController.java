package org.ce.sports.Api.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.dtos.Login;
import org.ce.sports.Api.dtos.Register;
import org.ce.sports.Api.entities.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody Login request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return authService.logout();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody Register request) {
        return authService.register(request);
    }
}