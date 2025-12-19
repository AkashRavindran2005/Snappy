package com.sermo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private Long ownerId;
    private LocalDateTime createdAt;
}

