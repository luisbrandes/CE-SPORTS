package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.enums.RoleEnum;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminApprovalService {

    private final UserRepository userRepository;


    public ResponseEntity<?> listarPendentes() {
        List<User> pendentes = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == RoleEnum.ROLE_ADMIN && !u.isVerified())
                .toList();

        return ResponseEntity.ok(pendentes);
    }


    public ResponseEntity<?> aprovarAdmin(Long id) {
        Optional<User> usuarioOpt = userRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado"));
        }

        User usuario = usuarioOpt.get();

        if (usuario.getRole() != RoleEnum.ROLE_ADMIN) {
            return ResponseEntity.status(400).body(Map.of("error", "Usuário não é um administrador."));
        }

        usuario.setVerified(true);
        userRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Administrador aprovado com sucesso!"));
    }

    public ResponseEntity<?> rejeitarAdmin(Long id) {
        Optional<User> usuarioOpt = userRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado."));
        }

        User usuario = usuarioOpt.get();

        if (usuario.getRole() != RoleEnum.ROLE_ADMIN) {
            return ResponseEntity.status(400).body(Map.of("error", "Usuário não é um administrador."));
        }


        if (usuario.isSystemAdmin()) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Não é possível excluir o administrador padrão do sistema."
            ));
        }


        userRepository.delete(usuario);

        return ResponseEntity.ok(Map.of("message", "Administrador rejeitado e removido com sucesso."));
    }
}

