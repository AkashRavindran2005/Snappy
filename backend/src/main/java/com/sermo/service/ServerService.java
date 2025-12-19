package com.sermo.service;

import com.sermo.dto.ServerDTO;
import com.sermo.model.Server;
import com.sermo.model.ServerMember;
import com.sermo.model.User;
import com.sermo.repository.ServerRepository;
import com.sermo.repository.ServerMemberRepository;
import com.sermo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServerService {

    @Autowired
    private ServerRepository serverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerMemberRepository serverMemberRepository;

    @Transactional
    public ServerDTO createServer(Long ownerId, String name, String description, Boolean isPublic) {
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Server server = new Server();
        server.setName(name);
        server.setDescription(description);
        server.setIsPublic(isPublic != null ? isPublic : true);
        server.setOwner(owner);

        server = serverRepository.save(server);

        // Add owner as member
        ServerMember member = new ServerMember();
        member.setServer(server);
        member.setUser(owner);
        serverMemberRepository.save(member);

        return toDTO(server);
    }

    public List<ServerDTO> getPublicServers() {
        return serverRepository.findByIsPublicTrue()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<ServerDTO> getUserServers(Long userId) {
        return serverMemberRepository.findByUserId(userId)
            .stream()
            .map(ServerMember::getServer)
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public ServerDTO joinServer(Long userId, Long serverId) {
        if (serverMemberRepository.existsByServerIdAndUserId(serverId, userId)) {
            throw new RuntimeException("Already a member of this server");
        }

        Server server = serverRepository.findById(serverId)
            .orElseThrow(() -> new RuntimeException("Server not found"));

        if (!server.getIsPublic()) {
            throw new RuntimeException("Server is private");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        ServerMember member = new ServerMember();
        member.setServer(server);
        member.setUser(user);
        serverMemberRepository.save(member);

        return toDTO(server);
    }

    private ServerDTO toDTO(Server server) {
        return new ServerDTO(
            server.getId(),
            server.getName(),
            server.getDescription(),
            server.getIsPublic(),
            server.getOwner().getId(),
            server.getCreatedAt()
        );
    }
}

