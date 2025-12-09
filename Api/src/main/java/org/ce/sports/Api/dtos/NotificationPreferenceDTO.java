package org.ce.sports.Api.dtos;

import lombok.Data;

@Data
public class NotificationPreferenceDTO {
    private Boolean newsNotifications;
    private Boolean eventNotifications;
    private Boolean projectNotifications;
}

