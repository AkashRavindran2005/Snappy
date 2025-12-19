package com.sermo.controller;

import com.sermo.model.ChannelKey;
import com.sermo.repository.ChannelKeyRepository;
import com.sermo.repository.ChannelRepository;
import com.sermo.repository.UserRepository;
import com.sermo.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/keys")
@CrossOrigin(origins = "*")
public class KeyController {

    @Autowired
    private ChannelKeyRepository channelKeyRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/channel/{channelId}")
    public ResponseEntity<Map<String, String>> shareChannelKey(
            Authentication authentication,
            @PathVariable Long channelId,
            @RequestBody Map<String, String> request) {
        Long userId = authUtil.getUserId(authentication);
        String encryptedKey = request.get("encryptedKey");

        ChannelKey channelKey = new ChannelKey();
        channelKey.setChannel(channelRepository.findById(channelId)
            .orElseThrow(() -> new RuntimeException("Channel not found")));
        channelKey.setUser(userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        channelKey.setEncryptedKey(encryptedKey);

        channelKeyRepository.save(channelKey);

        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<Map<String, String>> getChannelKey(
            Authentication authentication,
            @PathVariable Long channelId) {
        Long userId = authUtil.getUserId(authentication);

        ChannelKey channelKey = channelKeyRepository.findByChannelIdAndUserId(channelId, userId)
            .orElse(null);

        Map<String, String> response = new HashMap<>();
        if (channelKey != null) {
            response.put("encryptedKey", channelKey.getEncryptedKey());
        }
        return ResponseEntity.ok(response);
    }
}

