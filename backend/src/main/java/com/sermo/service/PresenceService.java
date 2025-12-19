package com.sermo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class PresenceService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String PRESENCE_PREFIX = "presence:";
    private static final String TYPING_PREFIX = "typing:";
    private static final long PRESENCE_TTL = 60; // 60 seconds
    private static final long TYPING_TTL = 5; // 5 seconds

    public void setOnline(Long userId, String channelId) {
        String key = PRESENCE_PREFIX + userId + ":" + channelId;
        redisTemplate.opsForValue().set(key, "online", PRESENCE_TTL, TimeUnit.SECONDS);
    }

    public void setOffline(Long userId) {
        String pattern = PRESENCE_PREFIX + userId + ":*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null) {
            redisTemplate.delete(keys);
        }
    }

    public boolean isOnline(Long userId, String channelId) {
        String key = PRESENCE_PREFIX + userId + ":" + channelId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void setTyping(Long userId, String channelId) {
        String key = TYPING_PREFIX + channelId + ":" + userId;
        redisTemplate.opsForValue().set(key, "typing", TYPING_TTL, TimeUnit.SECONDS);
    }

    public Set<String> getTypingUsers(String channelId) {
        String pattern = TYPING_PREFIX + channelId + ":*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys == null || keys.isEmpty()) {
            return Set.of();
        }
        return keys.stream()
            .map(key -> key.substring(key.lastIndexOf(":") + 1))
            .collect(java.util.stream.Collectors.toSet());
    }
}

