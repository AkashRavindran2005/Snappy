package com.sermo.repository;

import com.sermo.model.ChannelKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelKeyRepository extends JpaRepository<ChannelKey, Long> {
    Optional<ChannelKey> findByChannelIdAndUserId(Long channelId, Long userId);
    List<ChannelKey> findByChannelId(Long channelId);
    List<ChannelKey> findByUserId(Long userId);
}

