package com.sermo.repository;

import com.sermo.model.ServerMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServerMemberRepository extends JpaRepository<ServerMember, Long> {
    Optional<ServerMember> findByServerIdAndUserId(Long serverId, Long userId);
    List<ServerMember> findByUserId(Long userId);
    List<ServerMember> findByServerId(Long serverId);
    boolean existsByServerIdAndUserId(Long serverId, Long userId);
}

