package com.sermo.service;

import com.sermo.dto.MessageDTO;
import com.sermo.model.Channel;
import com.sermo.model.Message;
import com.sermo.model.User;
import com.sermo.repository.ChannelRepository;
import com.sermo.repository.MessageRepository;
import com.sermo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageDTO sendMessage(Long userId, Long channelId, String encryptedContent, String nonce) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Channel channel = channelRepository.findById(channelId)
            .orElseThrow(() -> new RuntimeException("Channel not found"));

        Message message = new Message();
        message.setSender(user);
        message.setChannel(channel);
        message.setEncryptedContent(encryptedContent);
        message.setNonce(nonce);

        message = messageRepository.save(message);

        return toDTO(message);
    }

    public List<MessageDTO> getChannelMessages(Long channelId) {
        return messageRepository.findByChannelIdOrderByCreatedAtAsc(channelId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public MessageDTO editMessage(Long messageId, Long userId, String encryptedContent, String nonce) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSender().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to edit this message");
        }

        message.setEncryptedContent(encryptedContent);
        message.setNonce(nonce);
        message.setEditedAt(LocalDateTime.now());

        message = messageRepository.save(message);

        return toDTO(message);
    }

    private MessageDTO toDTO(Message message) {
        return new MessageDTO(
            message.getId(),
            message.getSender().getId(),
            message.getSender().getUsername(),
            message.getChannel().getId(),
            message.getEncryptedContent(),
            message.getNonce(),
            message.getCreatedAt(),
            message.getEditedAt()
        );
    }
}

