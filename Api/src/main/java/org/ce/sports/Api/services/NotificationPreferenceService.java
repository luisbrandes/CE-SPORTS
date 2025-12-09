package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ce.sports.Api.dtos.NotificationPreferenceDTO;
import org.ce.sports.Api.dtos.NotificationPreferenceResponseDTO;
import org.ce.sports.Api.entities.NotificationPreference;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.NotificationPreferenceRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    // Obter preferências do usuário atual
    public NotificationPreferenceResponseDTO getMyPreferences() {
        User currentUser = getCurrentUser();

        return preferenceRepository.findByUser(currentUser)
                .map(this::convertToResponseDTO)
                .orElseGet(() -> {
                    // Se não existir, cria com valores padrão
                    NotificationPreference defaultPref = createDefaultPreference(currentUser);
                    return convertToResponseDTO(defaultPref);
                });
    }

    // Atualizar preferências do usuário atual
    public NotificationPreferenceResponseDTO updateMyPreferences(NotificationPreferenceDTO dto) {
        User currentUser = getCurrentUser();

        NotificationPreference preference = preferenceRepository.findByUser(currentUser)
                .orElseGet(() -> createDefaultPreference(currentUser));

        // Atualiza apenas os campos fornecidos
        if (dto.getNewsNotifications() != null) {
            preference.setNewsNotifications(dto.getNewsNotifications());
        }
        if (dto.getEventNotifications() != null) {
            preference.setEventNotifications(dto.getEventNotifications());
        }
        if (dto.getProjectNotifications() != null) {
            preference.setProjectNotifications(dto.getProjectNotifications());
        }

        NotificationPreference saved = preferenceRepository.save(preference);
        log.info("Preferências de notificação atualizadas para usuário ID: {}", currentUser.getId());

        return convertToResponseDTO(saved);
    }

    // Ativar/desativar todas as notificações
    public NotificationPreferenceResponseDTO toggleAllNotifications(Boolean enable) {
        User currentUser = getCurrentUser();

        NotificationPreference preference = preferenceRepository.findByUser(currentUser)
                .orElseGet(() -> createDefaultPreference(currentUser));

        preference.setNewsNotifications(enable);
        preference.setEventNotifications(enable);
        preference.setProjectNotifications(enable);

        NotificationPreference saved = preferenceRepository.save(preference);
        log.info("Todas as notificações {} para usuário ID: {}",
                enable ? "ativadas" : "desativadas", currentUser.getId());

        return convertToResponseDTO(saved);
    }

    // Verificar se usuário quer receber notificações de notícias
    public boolean shouldReceiveNewsNotifications(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .map(NotificationPreference::getNewsNotifications)
                .orElse(true); // Padrão: receber
    }

    // Verificar se usuário quer receber notificações de eventos
    public boolean shouldReceiveEventNotifications(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .map(NotificationPreference::getEventNotifications)
                .orElse(true); // Padrão: receber
    }

    // Verificar se usuário quer receber notificações de projetos
    public boolean shouldReceiveProjectNotifications(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .map(NotificationPreference::getProjectNotifications)
                .orElse(true); // Padrão: receber
    }

    // Métodos auxiliares
    private NotificationPreference createDefaultPreference(User user) {
        NotificationPreference preference = NotificationPreference.builder()
                .user(user)
                .newsNotifications(true)
                .eventNotifications(true)
                .projectNotifications(true)
                .build();

        return preferenceRepository.save(preference);
    }

    private NotificationPreferenceResponseDTO convertToResponseDTO(NotificationPreference preference) {
        NotificationPreferenceResponseDTO dto = new NotificationPreferenceResponseDTO();
        dto.setUserId(preference.getUser().getId());
        dto.setUserName(preference.getUser().getNome());
        dto.setUserEmail(preference.getUser().getEmail());
        dto.setNewsNotifications(preference.getNewsNotifications());
        dto.setEventNotifications(preference.getEventNotifications());
        dto.setProjectNotifications(preference.getProjectNotifications());
        return dto;
    }

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}