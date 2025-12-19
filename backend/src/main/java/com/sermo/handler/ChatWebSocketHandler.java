package com.sermo.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sermo.dto.MessageDTO;
import com.sermo.dto.WebSocketMessage;
import com.sermo.service.MessageService;
import com.sermo.service.PresenceService;
import com.sermo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private MessageService messageService;

    @Autowired
    private PresenceService presenceService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionUserMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token != null) {
            try {
                String username = jwtUtil.extractUsername(token);
                Long userId = jwtUtil.extractUserId(token);
                
                if (jwtUtil.validateToken(token, username)) {
                    sessions.put(session.getId(), session);
                    sessionUserMap.put(session.getId(), userId);
                } else {
                    session.close(CloseStatus.BAD_DATA);
                }
            } catch (Exception e) {
                session.close(CloseStatus.BAD_DATA);
            }
        } else {
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            WebSocketMessage wsMessage = objectMapper.readValue(message.getPayload(), WebSocketMessage.class);
            Long userId = sessionUserMap.get(session.getId());

            if (userId == null) {
                return;
            }

            switch (wsMessage.getType()) {
                case "MESSAGE":
                    handleMessage(session, userId, wsMessage);
                    break;
                case "TYPING":
                    handleTyping(session, userId, wsMessage);
                    break;
                case "PRESENCE":
                    handlePresence(session, userId, wsMessage);
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    private void handleMessage(WebSocketSession session, Long userId, WebSocketMessage wsMessage) throws IOException {
        Map<String, Object> payload = (Map<String, Object>) wsMessage.getPayload();
        Long channelId = Long.parseLong(payload.get("channelId").toString());
        String encryptedContent = (String) payload.get("encryptedContent");
        String nonce = (String) payload.get("nonce");

        // Store message (backend only sees encrypted content)
        MessageDTO messageDTO = messageService.sendMessage(userId, channelId, encryptedContent, nonce);

        // Broadcast to all sessions subscribed to this channel
        WebSocketMessage broadcast = new WebSocketMessage("MESSAGE", messageDTO);
        String broadcastJson = objectMapper.writeValueAsString(broadcast);

        sessions.values().forEach(s -> {
            try {
                s.sendMessage(new TextMessage(broadcastJson));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    @SuppressWarnings("unchecked")
    private void handleTyping(WebSocketSession session, Long userId, WebSocketMessage wsMessage) throws IOException {
        Map<String, Object> payload = (Map<String, Object>) wsMessage.getPayload();
        String channelId = payload.get("channelId").toString();

        presenceService.setTyping(userId, channelId);

        // Broadcast typing indicator
        WebSocketMessage broadcast = new WebSocketMessage("TYPING", Map.of(
            "userId", userId,
            "channelId", channelId
        ));
        String broadcastJson = objectMapper.writeValueAsString(broadcast);
        final TextMessage textMessage = new TextMessage(broadcastJson);

        sessions.values().forEach(s -> {
            try {
                s.sendMessage(textMessage);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    @SuppressWarnings("unchecked")
    private void handlePresence(WebSocketSession session, Long userId, WebSocketMessage wsMessage) throws IOException {
        Map<String, Object> payload = (Map<String, Object>) wsMessage.getPayload();
        String channelId = payload.get("channelId").toString();
        String status = (String) payload.get("status");

        if ("online".equals(status)) {
            presenceService.setOnline(userId, channelId);
        } else {
            presenceService.setOffline(userId);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long userId = sessionUserMap.remove(session.getId());
        sessions.remove(session.getId());
        if (userId != null) {
            presenceService.setOffline(userId);
        }
    }

    private String extractToken(WebSocketSession session) {
        java.net.URI uri = session.getUri();
        if (uri == null) {
            return null;
        }
        String query = uri.getQuery();
        if (query != null && query.contains("token=")) {
            return query.substring(query.indexOf("token=") + 6);
        }
        return null;
    }
}

