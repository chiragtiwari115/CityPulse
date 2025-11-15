package com.citypulse.citypulse.controller;

import com.citypulse.citypulse.dto.AuthResponse;
import com.citypulse.citypulse.service.Auth0Service;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/auth0")
@RequiredArgsConstructor
public class Auth0Controller {

    private final Auth0Service auth0Service;

    @GetMapping("/callback")
    public ResponseEntity<AuthResponse> handleCallback(
            @RequestParam("code") @NotBlank String code,
            @RequestParam(value = "state", required = false) String state) {
        // state validation can be added if front-end sends signed state
        AuthResponse response = auth0Service.handleCallback(code);
        return ResponseEntity.ok(response);
    }
}

