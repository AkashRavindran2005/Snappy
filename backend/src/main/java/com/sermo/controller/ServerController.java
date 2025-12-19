package com.sermo.controller;

import com.sermo.dto.ServerDTO;
import com.sermo.service.ServerService;
import com.sermo.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/servers")
@CrossOrigin(origins = "*")
public class ServerController {

    @Autowired
    private ServerService serverService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<ServerDTO> createServer(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {
        Long userId = authUtil.getUserId(authentication);
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        Boolean isPublic = request.get("isPublic") != null ? (Boolean) request.get("isPublic") : true;

        ServerDTO server = serverService.createServer(userId, name, description, isPublic);
        return ResponseEntity.ok(server);
    }

    @GetMapping("/public")
    public ResponseEntity<List<ServerDTO>> getPublicServers() {
        return ResponseEntity.ok(serverService.getPublicServers());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ServerDTO>> getMyServers(Authentication authentication) {
        Long userId = authUtil.getUserId(authentication);
        return ResponseEntity.ok(serverService.getUserServers(userId));
    }

    @PostMapping("/{serverId}/join")
    public ResponseEntity<ServerDTO> joinServer(
            Authentication authentication,
            @PathVariable Long serverId) {
        Long userId = authUtil.getUserId(authentication);
        ServerDTO server = serverService.joinServer(userId, serverId);
        return ResponseEntity.ok(server);
    }
}

