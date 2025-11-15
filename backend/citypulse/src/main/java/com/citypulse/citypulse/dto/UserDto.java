package com.citypulse.citypulse.dto;

public record UserDto(
        Long id,
        String username,
        String email,
        String role,
        boolean admin,
        String authProvider) {
}

