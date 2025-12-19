package com.sermo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDTO {
    private Long id;
    private String name;
    private String description;
    private Long serverId;
    private Boolean isPrivate;
    private LocalDateTime createdAt;
}

