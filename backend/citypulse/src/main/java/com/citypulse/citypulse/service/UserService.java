package com.citypulse.citypulse.service;

import com.citypulse.citypulse.dto.RegisterRequest;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.enums.Role;
import com.citypulse.citypulse.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("An account already exists for that email address.");
        }
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_USER)
                .admin(false)
                .build();
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
    }

    @Transactional
    public User upsertAuth0User(String auth0UserId, String email, String name) {
        return userRepository.findByAuth0ProviderId(auth0UserId)
                .map(existing -> updateAuth0Details(existing, email, name))
                .orElseGet(() -> createAuth0User(auth0UserId, email, name));
    }

    private User updateAuth0Details(User user, String email, String name) {
        user.setEmail(email);
        user.setUsername(name);
        return userRepository.save(user);
    }

    private User createAuth0User(String auth0UserId, String email, String name) {
        String randomPassword = generateRandomPassword();
        User user = User.builder()
                .username(name)
                .email(email)
                .password(passwordEncoder.encode(randomPassword))
                .role(Role.ROLE_USER)
                .admin(false)
                .auth0ProviderId(auth0UserId)
                .build();
        return userRepository.save(user);
    }

    private String generateRandomPassword() {
        return Long.toHexString(Double.doubleToLongBits(Math.random())) + Long.toHexString(System.nanoTime());
    }
}

