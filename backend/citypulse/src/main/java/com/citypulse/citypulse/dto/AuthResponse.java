package com.citypulse.citypulse.dto;

public record AuthResponse(String token, long expiresIn, UserDto user) {
}

