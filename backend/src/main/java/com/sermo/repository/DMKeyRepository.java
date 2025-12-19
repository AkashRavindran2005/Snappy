package com.sermo.repository;

import com.sermo.model.DMKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DMKeyRepository extends JpaRepository<DMKey, Long> {
    Optional<DMKey> findByUser1IdAndUser2IdOrUser1IdAndUser2Id(
        Long user1Id1, Long user2Id1, Long user1Id2, Long user2Id2
    );
}

