package com.sermo.controller;

import com.sermo.dto.*;
import com.sermo.model.User;
import com.sermo.repository.UserRepository;
import com.sermo.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPublicKey(request.getPublicKey());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPublicKey()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        // Auth disabled: always accept login.
        // Try to find by username; if not found, auto-create a user.
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            user = new User();
            user.setUsername(request.getUsername());
            // Use a synthetic email to satisfy NOT NULL + UNIQUE constraints
            user.setEmail(request.getUsername() + "@auto.local");
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setPublicKey("");
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPublicKey()
                )
        );
    }
}
