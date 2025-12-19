package com.sermo.controller;

import com.sermo.dto.MessageDTO;
import com.sermo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<MessageDTO>> getChannelMessages(@PathVariable Long channelId) {
        return ResponseEntity.ok(messageService.getChannelMessages(channelId));
    }

    @Autowired
    private com.sermo.util.AuthUtil authUtil;

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageDTO> editMessage(
            Authentication authentication,
            @PathVariable Long messageId,
            @RequestBody Map<String, String> request) {
        Long userId = authUtil.getUserId(authentication);
        String encryptedContent = request.get("encryptedContent");
        String nonce = request.get("nonce");

        MessageDTO message = messageService.editMessage(messageId, userId, encryptedContent, nonce);
        return ResponseEntity.ok(message);
    }
}

