package org.ce.sports.Api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "news_notifications", nullable = false)
    @Builder.Default
    private Boolean newsNotifications = true;

    @Column(name = "event_notifications", nullable = false)
    @Builder.Default
    private Boolean eventNotifications = true;

    @Column(name = "project_notifications", nullable = false)
    @Builder.Default
    private Boolean projectNotifications = true;
}