package com.sermo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dm_keys", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DMKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "encrypted_key_user1", columnDefinition = "TEXT", nullable = false)
    private String encryptedKeyUser1; // DM key encrypted with user1's public key

    @Column(name = "encrypted_key_user2", columnDefinition = "TEXT", nullable = false)
    private String encryptedKeyUser2; // DM key encrypted with user2's public key
}

