package org.ce.sports.Api.dtos;

import lombok.Data;

@Data
public class NotificationPreferenceResponseDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private Boolean newsNotifications;
    private Boolean eventNotifications;
    private Boolean projectNotifications;
}