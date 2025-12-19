package com.sermo.service;

import com.sermo.dto.ChannelDTO;
import com.sermo.model.Channel;
import com.sermo.model.Server;
import com.sermo.repository.ChannelRepository;
import com.sermo.repository.ServerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private ServerRepository serverRepository;

    @Transactional
    public ChannelDTO createChannel(Long serverId, String name, String description, Boolean isPrivate) {
        Server server = serverRepository.findById(serverId)
            .orElseThrow(() -> new RuntimeException("Server not found"));

        Channel channel = new Channel();
        channel.setName(name);
        channel.setDescription(description);
        channel.setServer(server);
        channel.setIsPrivate(isPrivate != null ? isPrivate : false);

        channel = channelRepository.save(channel);

        return toDTO(channel);
    }

    public List<ChannelDTO> getServerChannels(Long serverId) {
        return channelRepository.findByServerId(serverId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    private ChannelDTO toDTO(Channel channel) {
        return new ChannelDTO(
            channel.getId(),
            channel.getName(),
            channel.getDescription(),
            channel.getServer().getId(),
            channel.getIsPrivate(),
            channel.getCreatedAt()
        );
    }
}

