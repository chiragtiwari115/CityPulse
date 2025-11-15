package com.citypulse.citypulse.controller;

import com.citypulse.citypulse.dto.UserDto;
import com.citypulse.citypulse.entity.User;
import com.citypulse.citypulse.mapper.UserMapper;
import com.citypulse.citypulse.security.UserPrincipal;
import com.citypulse.citypulse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserDto> currentUser(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.findByEmail(principal.getUsername());
        return ResponseEntity.ok(userMapper.toDto(user));
    }
}

