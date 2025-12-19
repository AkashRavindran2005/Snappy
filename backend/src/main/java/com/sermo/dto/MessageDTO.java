package com.sermo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long channelId;
    private String encryptedContent;
    private String nonce;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
}

