package org.ce.sports.Api.services;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.NotificationPreference;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.NotificationPreferenceRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository repo;
    private final UserRepository userRepository;


    public boolean shouldReceiveNewsNotifications(Long userId) {
        return repo.findById(userId)
                .map(NotificationPreference::isReceiveNews)
                .orElseGet(() ->
                        userRepository.findById(userId)
                                .map(User::isReceberNotificacoes)
                                .orElse(true)
                );
    }

    public boolean getPreference(Long userId) {
        return shouldReceiveNewsNotifications(userId);
    }

    public void updatePreference(Long userId, boolean receive) {
        NotificationPreference pref = repo.findById(userId)
                .orElseGet(() -> {
                    NotificationPreference np = new NotificationPreference();
                    np.setUserId(userId);
                    return np;
                });

        pref.setReceiveNews(receive);
        repo.save(pref);

        userRepository.findById(userId).ifPresent(u -> {
            u.setReceberNotificacoes(receive);
            userRepository.save(u);
        });
    }
}
