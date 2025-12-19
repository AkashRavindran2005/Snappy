package com.sermo.controller;

import com.sermo.dto.ChannelDTO;
import com.sermo.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin(origins = "*")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @PostMapping
    public ResponseEntity<ChannelDTO> createChannel(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {
        Long serverId = Long.parseLong(request.get("serverId").toString());
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        Boolean isPrivate = request.get("isPrivate") != null ? (Boolean) request.get("isPrivate") : false;

        ChannelDTO channel = channelService.createChannel(serverId, name, description, isPrivate);
        return ResponseEntity.ok(channel);
    }

    @GetMapping("/server/{serverId}")
    public ResponseEntity<List<ChannelDTO>> getServerChannels(@PathVariable Long serverId) {
        return ResponseEntity.ok(channelService.getServerChannels(serverId));
    }
}

