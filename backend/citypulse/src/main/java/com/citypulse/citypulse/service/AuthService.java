package com.citypulse.citypulse.service;

import com.citypulse.citypulse.dto.AuthRequest;
import com.citypulse.citypulse.dto.AuthResponse;
import com.citypulse.citypulse.dto.RegisterRequest;
import com.citypulse.citypulse.dto.UserDto;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.mapper.UserMapper;
import com.citypulse.citypulse.security.JwtService;
import com.citypulse.citypulse.security.UserPrincipal;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMillis;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        User user = userService.registerUser(request);
        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());
        return buildAuthResponse(user);
    }

    private String generateToken(UserPrincipal principal) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", principal.getId());
        claims.put("isAdmin", principal.isAdmin());
        claims.put("role", principal.getAuthorities().stream().findFirst().map(Object::toString).orElse("ROLE_USER"));
        return jwtService.generateToken(principal, claims);
    }

    private AuthResponse buildAuthResponse(String token, UserDto userDto) {
        long expiresInSeconds = expirationMillis / 1000;
        return new AuthResponse(token, expiresInSeconds, userDto);
    }

    public AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.fromUser(user);
        String token = generateToken(principal);
        UserDto userDto = userMapper.toDto(user);
        return buildAuthResponse(token, userDto);
    }
}

