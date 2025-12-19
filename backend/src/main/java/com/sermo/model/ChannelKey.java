package com.sermo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "channel_keys", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"channel_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "encrypted_key", columnDefinition = "TEXT", nullable = false)
    private String encryptedKey; // Channel key encrypted with user's public key (base64)
}

