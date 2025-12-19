package com.sermo.repository;

import com.sermo.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {
    List<Server> findByIsPublicTrue();
    List<Server> findByOwnerId(Long ownerId);
}

